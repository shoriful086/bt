import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { paymentNoticeController } from "./paymentController";

const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  paymentNoticeController.getAllPaymentNotice
);
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  paymentNoticeController.insertInToDB
);

router.delete(
  "/:noticeId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  paymentNoticeController.deleteNotice
);

export const PaymentNoticeRoutes = router;
