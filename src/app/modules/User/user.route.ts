import express from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserController } from "./user.controller";
import { checkBlockedStatus } from "../../middlewares/checkBlock";

type TUserRole = "ADMIN" | "USER";

const UserRole: Record<TUserRole, string> = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const router = express.Router();

// get user profile
router.get("/profile", auth(), checkBlockedStatus, UserController.getMyProfile);

// update user profile
router.put(
  "/update-profile",
  auth(),
  fileUploader.upload.fields([{ name: "image", maxCount: 1 }]),
  UserController.updateUser
);
router.put("/role-change", auth(), UserController.changeUserRole);
router.get("/admin/users", auth(UserRole.ADMIN), UserController.getAllUsers);
router.get("/admin/user/:id", auth(UserRole.ADMIN), UserController.getSingleUserById);
router.patch("/admin/user/suspend/:id", auth(UserRole.ADMIN), UserController.suspendUser);
router.delete("/admin/user/:id", auth(UserRole.ADMIN), UserController.removeUserByAdmin);

export const userRoutes = router;
