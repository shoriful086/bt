import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { withdrawController } from "./withdraw.controller";

const router = express.Router();

router.get(
  "/pending",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  withdrawController.getPendingWithdraw
);

router.get(
  "/paid",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  withdrawController.getPaidWithdraw
);

router.post("/", auth(UserRole.APP_USER), withdrawController.insertInToDB);

router.patch(
  "/:withdrawId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  withdrawController.updateWithdrawStatus
);

export const WithdrawRoutes = router;
