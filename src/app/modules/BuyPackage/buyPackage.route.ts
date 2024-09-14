import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { buyPackageController } from "./buyPackage.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  buyPackageController.getAllPackage
);
router.get(
  "/my-package",
  auth(UserRole.APP_USER),
  buyPackageController.getMyPurchasePackage
);

router.post("/", auth(UserRole.APP_USER), buyPackageController.buyPackage);

export const BuyPackageRoutes = router;
