import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import { prisma } from "../../lib/prisma";

const optionalAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check if authorization header exists
      const token = req.headers.authorization;

      // If no token, skip authentication and continue
      if (!token) {
        return next(); // Skip to the next middleware or route handler
      }

      // If token exists, verify it
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      const { id, role, iat } = verifiedUser;

      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

      // Attach the user to the request object
      req.user = verifiedUser as JwtPayload;

      // If roles are provided, check if the user"s role is allowed
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      next(); // Continue to the next middleware or route handler
    } catch (err) {
      next(err); // Pass any errors to the error handler
    }
  };
};

export default optionalAuth;
