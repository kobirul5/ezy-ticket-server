import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { EventServices } from "./event.service";
import pick from "../../../shared/pick";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.createEvent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "eventType", "status", "advertise"]);
  const result = await EventServices.getAllEvents(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully",
    data: result,
  });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventServices.getSingleEvent(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fetched successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventServices.updateEvent(Number(id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventServices.deleteEvent(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully",
    data: result,
  });
});

const getMyAddedEvents = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const result = await EventServices.getMyAddedEvents(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My events fetched successfully",
    data: result,
  });
});

export const EventControllers = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getMyAddedEvents,
};
