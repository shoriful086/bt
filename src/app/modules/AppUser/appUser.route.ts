import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { appUserController } from "./appUser.controller";
import { appUserValidation } from "./appUser.validation";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  appUserController.getAllUserFromDB
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  appUserController.getUserById
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  appUserController.deleteUser
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = appUserValidation.updateUserValidation.parse(req.body);
    return appUserController.updateUser(req, res, next);
  }
);
export const AppUserRoutes = router;
