import { UserRole } from "@prisma/client";
import express from "express";
import { auth } from "../../middlewares/auth";
import { multiplyController } from "./multiply.controller";
const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  multiplyController.getAllMultiplyData
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  multiplyController.insertIntoDB
);

export const MultiplyRoutes = router;
