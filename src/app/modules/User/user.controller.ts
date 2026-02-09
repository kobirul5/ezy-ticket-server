import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { UserService } from "./user.services";
import { FileUploadHelper } from "../../../helpars/fileUploadHelper";

// get user profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.getMyProfile(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

// update user profile
const updateUser = catchAsync(async (req: Request, res: Response) => {

  let updateData = req.body;

  if (req.body.data) {
     updateData = JSON.parse(req.body.data);
  }

  const file = req.file;

  // Call the service with userId, data, and file
  const result = await UserService.updateUser(
    req.user.id,
    updateData,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});


const getSingleUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const result = await UserService.getSingleUserById(id, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = { searchTerm: req.query.searchTerm as string, ...req.query };
  // remove non-filter fields from filters object manually or use pick
  const filterData = { ...req.query };
  const excludeFields = ["page", "limit", "sortBy", "sortOrder", "searchTerm"];
  excludeFields.forEach(field => delete (filterData as any)[field]);
  const finalFilters = { searchTerm: req.query.searchTerm as string, ...filterData };

  // Better to use pick if available
  // const filters = pick(req.query, userFilterableFields); // userFilterableFields logic from somewhere
  // Explicitly defining standard pagination options
  const options = {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
    sortBy: req.query.sortBy as string || "createdAt",
    sortOrder: req.query.sortOrder as string || "desc"
  };

  const result = await UserService.getAllUsers(finalFilters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const suspendUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.suspendUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User suspended successfully",
    data: result,
  });
});

//delete user
const removeUserByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.removeUserByAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User remove successfully",
    data: result,
  });
});
// change user role

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { role } = req.body;
  const result = await UserService.changeUserRole(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role changed successfully",
    data: result,
  });

})


const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await UserService.getUserByEmail(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
})

export const UserController = {
  getMyProfile,
  updateUser,
  getSingleUserById,
  removeUserByAdmin,
  changeUserRole,
  getAllUsers,
  suspendUser,
  getUserByEmail
};
