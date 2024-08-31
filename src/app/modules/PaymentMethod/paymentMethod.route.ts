import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { paymentMethodController } from "./paymentMethod.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { paymentMethodValidation } from "./paymentMethod.validation";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  paymentMethodController.getAllPaymentMethod
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = paymentMethodValidation.createMethod.parse(
      JSON.parse(req.body.data)
    );
    return paymentMethodController.createMethod(req, res, next);
  }
);

export const PaymentMethodRoutes = router;
