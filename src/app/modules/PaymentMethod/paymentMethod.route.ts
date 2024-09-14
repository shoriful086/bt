import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { paymentMethodController } from "./paymentMethod.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { paymentMethodValidation } from "./paymentMethod.validation";
const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  paymentMethodController.getAllPaymentMethod
);

router.get(
  "/private-number",
  auth(UserRole.DEVELOPER, UserRole.APP_USER),
  paymentMethodController.getPrivateNumber
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = paymentMethodValidation.createMethod.parse(
      JSON.parse(req.body.data)
    );
    return paymentMethodController.createMethod(req, res, next);
  }
);

router.post(
  "/private-number",
  auth(UserRole.DEVELOPER),
  paymentMethodController.createPrivateNumber
);

router.delete(
  "/:paymentMethodId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  paymentMethodController.deletePaymentMethod
);

router.patch(
  "/private-number/count-status",
  auth(UserRole.APP_USER, UserRole.DEVELOPER),
  paymentMethodController.updatePrivateNumberCount
);

router.delete(
  "/private-number/:id",
  auth(UserRole.DEVELOPER),
  paymentMethodController.deletePrivateNumber
);
export const PaymentMethodRoutes = router;
