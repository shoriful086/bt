import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { betController } from "./bet.controller";

const router = express.Router();

router.get("/", auth(UserRole.APP_USER), betController.getMyLastSpinBet);
router.post("/", auth(UserRole.APP_USER), betController.createBet);

export const BetRoutes = router;
