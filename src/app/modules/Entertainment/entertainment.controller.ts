import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { EntertainmentServices } from "./entertainment.service";
import pick from "../../../shared/pick";

const createCinemaHall = catchAsync(async (req: Request, res: Response) => {
  const result = await EntertainmentServices.createCinemaHall(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Cinema Hall created successfully",
    data: result,
  });
});

const getAllCinemaHalls = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "location"]);
  const result = await EntertainmentServices.getAllCinemaHalls(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cinema Halls fetched successfully",
    data: result,
  });
});

const createMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await EntertainmentServices.createMovie(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Movie created successfully",
    data: result,
  });
});

const getAllMovies = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "genre", "category"]);
  const result = await EntertainmentServices.getAllMovies(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movies fetched successfully",
    data: result,
  });
});

const getSingleMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EntertainmentServices.getSingleMovie(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie fetched successfully",
    data: result,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EntertainmentServices.updateMovie(Number(id), req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie updated successfully",
    data: result,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EntertainmentServices.deleteMovie(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie deleted successfully",
    data: result,
  });
});

export const EntertainmentControllers = {
  createCinemaHall,
  getAllCinemaHalls,
  createMovie,
  getAllMovies,
  getSingleMovie,
  updateMovie,
  deleteMovie,
};
