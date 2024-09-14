import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { spinController } from "./spin.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  spinController.getAllSpin
);
router.post("/", auth(UserRole.APP_USER), spinController.insertInToDB);

export const SpinRoutes = router;
