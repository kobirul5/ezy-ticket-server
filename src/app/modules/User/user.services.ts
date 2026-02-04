
import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { Prisma, UserStatus } from "../../../generated/prisma/client";
import ApiError from "../../../errors/ApiErrors";

const getMyProfile = async (userId: number) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return result;
};

const updateUser = async (
  userId: number,
  updateData: Partial<Prisma.UserUpdateInput>,
  imageUrl?: string
) => {
  if (imageUrl) {
    updateData.picture = imageUrl;
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });
  return result;
};

const getSingleUserById = async (id: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const result = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return {
    meta: {
      page,
      limit,
      total: 1, // Simplified for single user
    },
    data: result,
  };
};

const getAllUsers = async (filters: any, options: any) => {
  const { page, limit, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: "insensitive" } },
      { email: { contains: filters.searchTerm, mode: "insensitive" } },
    ];
  }

  const result = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({ where });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const suspendUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      status: "SUSPENDED" as UserStatus,
    },
  });
  return result;
};

const removeUserByAdmin = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  return result;
};

const changeUserRole = async (userId: number, role: any) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
  return result;
};

export const UserService = {
  getMyProfile,
  updateUser,
  getSingleUserById,
  getAllUsers,
  suspendUser,
  removeUserByAdmin,
  changeUserRole,
};
