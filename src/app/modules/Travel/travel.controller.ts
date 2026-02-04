import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TravelServices } from "./travel.service";
import pick from "../../../shared/pick";

const createBusService = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelServices.createBusService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bus service created successfully",
    data: result,
  });
});

const getAllBusServices = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelServices.getAllBusServices();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus services fetched successfully",
    data: result,
  });
});

const createBusTicket = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelServices.createBusTicket(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bus ticket created successfully",
    data: result,
  });
});

const getAllBusTickets = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "from", "to", "date"]);
  const result = await TravelServices.getAllBusTickets(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus tickets fetched successfully",
    data: result,
  });
});

export const TravelControllers = {
  createBusService,
  getAllBusServices,
  createBusTicket,
  getAllBusTickets,
};
