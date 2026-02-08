
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../errors/ApiErrors";

const createUserIntoDb = async (data: any) => {

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })


  const token = jwtHelpers.generateToken(
    { id: result.id, role: result.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    ...result,
    token,
  };
};

const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === "SUSPENDED") {
    throw new ApiError(httpStatus.FORBIDDEN, "User account is suspended");
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password as string);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const token = jwtHelpers.generateToken(
    { id: user.id, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    user,
    token,
  };
};

const changePassword = async (userId: number, newPassword: string, oldPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password as string);
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password matched");
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

const forgotPassword = async (data: any) => {
  // Implementation for forgot password (e.g., OTP generation, email sending)
  // For now, return a placeholder
  return { message: "OTP sent to your email" };
};

const resendOtp = async (email: string) => {
  return { message: "OTP resent" };
};

const verifyForgotPasswordOtp = async (data: any) => {
  // Placeholder for OTP verification
  const token = jwtHelpers.generateToken(
    { email: data.email },
    config.jwt.jwt_secret as Secret,
    "1h"
  );
  return { token };
};

const resetPassword = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.newPassword, Number(config.bcrypt_salt_rounds));
  await prisma.user.update({
    where: { email: data.email },
    data: { password: hashedPassword },
  });
};

const deleteUser = async (userId: number) => {
  const result = await prisma.user.delete({
    where: { id: userId },
  });
  return result;
};

const sendOtpEmail = async (email: string) => {
  return { message: "OTP sent" };
};

export const AuthServices = {
  createUserIntoDb,
  loginUser,
  changePassword,
  forgotPassword,
  resendOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  deleteUser,
  sendOtpEmail,
};
