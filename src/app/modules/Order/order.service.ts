import { prisma } from "../../../lib/prisma";
const SSLCommerzPayment = require("sslcommerz-lts");
import config from "../../../config";

const createOrder = async (data: any) => {
  const { total_amount, cus_name, cus_email, cus_phone, cus_add1, productName } = data;
  const tranId = `TRAN-${Date.now()}`;

  const orderData = {
    customerEmail: cus_email,
    productName: productName || "Ticket",
    totalAmount: parseFloat(total_amount),
    tranId: tranId,
    paymentMethod: "SSLCOMMERZ",
    orderData: data,
  };

  const result = await prisma.order.create({
    data: orderData,
  });

  const paymentData = {
    total_amount: total_amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${process.env.SERVER_URL}/api/v1/orders/payment/success/${tranId}`,
    fail_url: `${process.env.SERVER_URL}/api/v1/orders/payment/fail/${tranId}`,
    cancel_url: `${process.env.SERVER_URL}/api/v1/orders/payment/cancel/${tranId}`,
    ipn_url: `${process.env.SERVER_URL}/api/v1/orders/payment/ipn`,
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
    process.env.STORE_ID,
    process.env.STORE_PASS,
    false // true for live, false for sandbox
  );

  const apiResponse = await sslcz.init(paymentData);
  return { url: apiResponse.GatewayPageURL, tranId };
};

const handlePaymentSuccess = async (tranId: string) => {
  const result = await prisma.order.update({
    where: { tranId },
    data: {
      paidStatus: true,
      paymentTime: new Date().toLocaleString(),
      status: "completed",
    },
  });
  return result;
};

const handlePaymentFail = async (tranId: string) => {
  const result = await prisma.order.update({
    where: { tranId },
    data: {
      status: "failed",
    },
  });
  return result;
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
  getOrderByTranId,
  getAllOrders,
};
