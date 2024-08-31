import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { completeTaskController } from "./completeTask.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  completeTaskController.getAllCompleteTask
);
router.post("/", auth(UserRole.APP_USER), completeTaskController.insertInToDB);

export const CompleteTaskRoutes = router;
