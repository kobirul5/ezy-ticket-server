import { prisma } from "../../../lib/prisma";
const SSLCommerzPayment = require("sslcommerz-lts");
import config from "../../../config";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { ProductType } from "../../../generated/prisma/enums";
import { TravelServices } from "../Travel/travel.service";

const createOrder = async (data: any) => {
  const { total_amount, cus_name, cus_email, cus_phone, cus_add1, productName, busPostId, eventId, verifyData, routeAndDateAndTime } = data;
  const tranId = `TRAN-${Date.now()}`;

  if(!routeAndDateAndTime.date){
    throw new ApiError(httpStatus.BAD_REQUEST, "Date is required")
  }


  // Determine productId
  let productId = 0;
  if (busPostId) {
    if (typeof busPostId === "string" && busPostId.startsWith("virtual-")) {
      productId = parseInt(busPostId.split("-")[1]);
    } else {
      productId = parseInt(busPostId);
    }
  } else if (eventId) {
    productId = parseInt(eventId);
  }

 const orderData = {
    customerName: cus_name,
    customerEmail: cus_email,
    productId: productId,
    productType: verifyData === "bus" ? ProductType.BUS : (verifyData === "event" ? ProductType.EVENT : ProductType.BUS),
    totalAmount: parseFloat(total_amount),
    tranId: tranId,
    paymentMethod: "SSLCOMMERZ",
    orderData: data,
  };

  const result = await prisma.order.create({
    data: orderData as any,
  });


  if(!result){
    throw new ApiError(httpStatus.BAD_REQUEST, "Order not created")
  }


  const paymentData = {
    total_amount: total_amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.server_url}/api/v1/orders/payment/success/${tranId}`,
    fail_url: `${config.server_url}/api/v1/orders/payment/fail/${tranId}`,
    cancel_url: `${config.server_url}/api/v1/orders/payment/cancel/${tranId}`,
    ipn_url: `${config.server_url}/api/v1/orders/payment/ipn`,
    shipping_method: "Courier",
    product_name: productName || "Ticket",
    product_category: "Ticketing",
    product_profile: "general",
    cus_name: cus_name,
    cus_email: cus_email,
    cus_add1: cus_add1,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: cus_phone,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(
    config.sslcommerz.store_id,
    config.sslcommerz.store_pass,
    config.sslcommerz.is_live
  );

  const apiResponse = await sslcz.init(paymentData);
  
  if (apiResponse?.status === "SUCCESS") {
    return { url: apiResponse.GatewayPageURL, tranId };
  } else {
    throw new Error(apiResponse?.failedreason || "SSLCommerz initialization failed");
  }
};

const handlePaymentSuccess = async (tranId: string) => {
  const order = await prisma.order.findUnique({ where: { tranId } });
  if (!order) throw new Error("Order not found");

  if (order.paidStatus) return order; // Already processed

  const result = await prisma.order.update({
    where: { tranId },
    data: {
      paidStatus: true,
      status: "SUCCESSED",
    },
  });

  // Handle Seat Booking for Bus Tickets
  const orderData = order.orderData as any;
  if (orderData?.verifyData === "bus") {
    const { busPostId, selectedSeats, routeAndDateAndTime } = orderData;
    let scheduleId: number;

    if (typeof busPostId === "string" && busPostId.startsWith("virtual-")) {
      // It's a virtual trip, create the schedule record
      const busServiceId = parseInt(busPostId.split("-")[1]);
      const date = routeAndDateAndTime.date;
      const time = routeAndDateAndTime.time || busPostId.split("-")[3]; // Fallback to parsing ID
      
      const schedule = await TravelServices.findOrCreateSchedule(busServiceId, date, time);
      scheduleId = schedule.id;
    } else {
      scheduleId = parseInt(busPostId);
    }

    if (scheduleId) {
      await TravelServices.updateBookedSeats(scheduleId, selectedSeats);
    }
  }

  return result;
};

const handlePaymentFail = async (tranId: string) => {
  const result = await prisma.order.update({
    where: { tranId },
    data: {
      status: "FAILED",
    },
  });
  return result;
};

const handlePaymentCancel = async (tranId: string) => {
  const result = await prisma.order.update({
    where: { tranId },
    data: {
      status: "CANCELLED",
    },
  });
  return result;
};

const handleIPN = async (payload: any) => {
  const { tran_id, status } = payload;
  if (status === "VALID") {
    return await handlePaymentSuccess(tran_id);
  } else {
    return await handlePaymentFail(tran_id);
  }
};

const getOrderByTranId = async (tranId: string) => {
    const result = await prisma.order.findUnique({
        where: { tranId }
    })
    return result;
}

const getAllOrders = async () => {
  return await prisma.order.findMany({
    where: { paidStatus: true },
    orderBy: { createdAt: "desc" },
  });
};

export const OrderServices = {
  createOrder,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handleIPN,
  getOrderByTranId,
  getAllOrders,
};
