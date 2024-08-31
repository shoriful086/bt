import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { signUpBonusController } from "./signUpBonus.controller";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  signUpBonusController.getBonusData
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  signUpBonusController.insertInToDB
);

export const SignUpBonusRoutes = router;
