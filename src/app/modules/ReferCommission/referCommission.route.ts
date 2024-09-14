import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { referCommissionController } from "./referCommission.controller";

const router = express.Router();
router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.APP_USER,
    UserRole.DEVELOPER
  ),
  referCommissionController.getBonusData
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  referCommissionController.insertInToDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  referCommissionController.deleteBonusData
);
export const ReferCommissionRoutes = router;
