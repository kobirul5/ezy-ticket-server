import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OrderServices } from "./order.service";
import config from "../../../config";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, "----------------");
  const result = await OrderServices.createOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment link generated",
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderServices.handlePaymentSuccess(tranId);
  res.redirect(`${config.client.url}/payment/success/${tranId}`);
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderServices.handlePaymentFail(tranId);
  res.redirect(`${config.client.url}/payment/fail/${tranId}`);
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderServices.handlePaymentCancel(tranId);
  res.redirect(`${config.client.url}/payment/cancel/${tranId}`);
});

const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.handleIPN(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "IPN received successfully",
    data: result,
  });
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
    const { tranId } = req.params;
    const result = await OrderServices.getOrderByTranId(tranId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
})

const getMyBusOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await OrderServices.getMyBusOrders(Number(userId));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My bus orders fetched successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getOrder,
  getAllOrders,
  getMyBusOrders,
};
