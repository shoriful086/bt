import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { signUpBonusController } from "./signUpBonus.controller";
const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  signUpBonusController.getBonusData
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  signUpBonusController.insertInToDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  signUpBonusController.deleteBonusData
);

export const SignUpBonusRoutes = router;
