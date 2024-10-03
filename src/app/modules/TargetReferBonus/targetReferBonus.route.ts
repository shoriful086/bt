import express from "express";
import { targetReferBonusController } from "./targetReferBonus.controller";

import { UserRole } from "@prisma/client";
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
  targetReferBonusController.getAllFromDB
);

router.get(
  "/my-claimed-data",
  auth(UserRole.APP_USER),
  targetReferBonusController.getMyReferClaimedData
);
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  targetReferBonusController.insertInToDB
);

router.post(
  "/claim-bonus",
  auth(UserRole.APP_USER),
  targetReferBonusController.claimTargetReferBonus
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  targetReferBonusController.deleteTargetReferBonusData
);
export const TargetReferBonusRoute = router;
