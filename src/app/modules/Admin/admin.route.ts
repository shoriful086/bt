import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { getAllAdminController } from "./admin.controller";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.DEVELOPER),
  getAllAdminController.getAllAdmin
);

export const AdminRoutes = router;
