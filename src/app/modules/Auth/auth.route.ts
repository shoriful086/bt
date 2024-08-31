import express from "express";
import { authController } from "./auth.contorller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/user-login", authController.loginUser);
router.post("/admin-login", authController.loginAdmin);

router.patch(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  authController.changePassword
);

export const AuthRoutes = router;
