import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import { Schema } from "zod";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUserFromDB
);
router.get(
  "/my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  userController.getMyProfile
);

router.post(
  "/create-user",
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAppUser.parse(req.body);
    return userController.createUser(req, res, next);
  }
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(req.body);
    return userController.createAdmin(req, res, next);
  }
);

router.patch(
  "/update-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  (req, res, next) => {
    req.body = userValidation.updateUser.parse(req.body);
    return userController.updateProfile(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req, res, next) => {
    req.body = userValidation.updateUserStatus.parse(req.body);
    return userController.updateUserStatus(req, res, next);
  }
);
export const UserRoutes = router;
