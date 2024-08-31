import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { referCommissionController } from "./referCommission.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  referCommissionController.insertInToDB
);

export const ReferCommissionRoutes = router;
