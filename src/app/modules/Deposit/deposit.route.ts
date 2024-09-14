import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { depositController } from "./deposit.controller";
import { depositValidation } from "./deposit.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.getAllDepositData
);
router.get(
  "/bonus",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.getBonusData
);

router.get(
  "/pending",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.getPendingDeposit
);

router.get(
  "/success",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.getSuccessDeposit
);

router.get(
  "/rejected",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.getRejectedDeposit
);

router.post(
  "/",
  auth(UserRole.APP_USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = depositValidation.createDeposit.parse(req.body);
    return depositController.insertInToDB(req, res, next);
  }
);

router.post(
  "/bonus",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = depositValidation.depositBonus.parse(req.body);
    return depositController.depositBonus(req, res, next);
  }
);

router.patch(
  "/:depositId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = depositValidation.updateDeposit.parse(req.body);
    return depositController.updateDepositStatus(req, res, next);
  }
);
router.delete(
  "/bonus/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  depositController.deleteBonusData
);

export const DepositRoutes = router;
