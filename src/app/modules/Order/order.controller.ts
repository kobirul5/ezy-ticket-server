import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
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
  res.redirect(`${process.env.CLIENT_URL}/payment/success/${tranId}`);
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderServices.handlePaymentFail(tranId);
  res.redirect(`${process.env.CLIENT_URL}/payment/fail/${tranId}`);
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
  getOrder,
  getAllOrders,
};
