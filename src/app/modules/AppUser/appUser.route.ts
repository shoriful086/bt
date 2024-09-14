import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { appUserController } from "./appUser.controller";
import { appUserValidation } from "./appUser.validation";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  appUserController.getAllUserFromDB
);
router.get(
  "/my-dashboard-data",
  auth(UserRole.APP_USER),
  appUserController.getMyDashboardData
);

router.get(
  "/blocked",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  appUserController.getBlockedFromDB
);

router.get(
  "/my-refer",
  auth(UserRole.APP_USER),
  appUserController.getMyReferList
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  appUserController.getUserById
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  appUserController.userUnblocked
);

router.patch(
  "/update/:userId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = appUserValidation.updateUserValidation.parse(req.body);
    return appUserController.updateUser(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  appUserController.blockedUser
);
export const AppUserRoutes = router;
