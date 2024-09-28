import { UserRole } from "@prisma/client";
import express from "express";
import { referBonusController } from "./referBonus.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  referBonusController.getDataFromDB
);
router.get(
  "/get-reward",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  referBonusController.getReferBonusData
);

router.get(
  "/my-bonus",
  auth(UserRole.APP_USER),
  referBonusController.getMyRewardData
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  referBonusController.insertInToDB
);

export const ReferBonusRoutes = router;
