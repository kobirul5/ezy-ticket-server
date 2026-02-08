import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TravelServices } from "./travel.service";
import pick from "../../../shared/pick";
import { FileUploadHelper } from "../../../helpars/fileUploadHelper";

const createBusService = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const file = req.file;
  
  let data = req.body;
  if (req.body.data) {
    data = JSON.parse(req.body.data);
  }

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file as any);
    if (uploadedImage) {
      data.image = uploadedImage.secure_url;
    }
  }

  const result = await TravelServices.createBusService({
    ...data,
    userId: Number(userId),
  });
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bus service created successfully",
    data: result,
  });
});

const getAllBusServices = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  let userId = undefined;
  
  if (user && user.role === "TRAVEL_MANAGER") {
    userId = Number(user.id);
  }

  const result = await TravelServices.getAllBusServices(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus services fetched successfully",
    data: result,
  });
});

const getBusById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TravelServices.getBusById(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus service fetched successfully",
    data: result,
  });
});

const updateBusService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;
  
  let data = req.body;
  if (req.body.data) {
    data = JSON.parse(req.body.data);
  }

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file as any);
    if (uploadedImage) {
      data.image = uploadedImage.secure_url;
    }
  }

  const result = await TravelServices.updateBusService(Number(id), data);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus service updated successfully",
    data: result,
  });
});

const deleteBusService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TravelServices.deleteBusService(Number(id));
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus service deleted successfully",
    data: result,
  });
});

const createBusSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelServices.createBusSchedule(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bus schedule created successfully",
    data: result,
  });
});

const getAllBusTickets = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "from", "to", "date"]);
  const result = await TravelServices.getAllBusTickets(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus trips fetched successfully",
    data: result,
  });
});

const getBusStands = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelServices.getBusStands();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bus stands fetched successfully",
    data: result,
  });
});

const createTravelLocation = catchAsync(async (req: Request, res: Response) => {
    const result = await TravelServices.createTravelLocation(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Travel Location Created Successfully",
        data: result
    })
})

const getAllTravelLocations = catchAsync(async (req: Request, res: Response) => {
    const { searchTerm } = req.query;
    const result = await TravelServices.getAllTravelLocations(searchTerm as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Travel Locations Retrieved Successfully",
        data: result
    })
})


export const TravelControllers = {
  createBusService,
  getAllBusServices,
  getBusById,
  updateBusService,
  deleteBusService,
  createBusSchedule,
  getAllBusTickets,
  getBusStands,
  createTravelLocation,
  getAllTravelLocations
};
