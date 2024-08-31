import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { packageController } from "./package.controller";
import { packageValidation } from "./package.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  packageController.getAllPackage
);

router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = packageValidation.createPackage.parse(req.body);
    return packageController.createPackage(req, res, next);
  }
);

router.delete(
  "/:packageId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  packageController.deletePackage
);

export const PackageRoutes = router;
