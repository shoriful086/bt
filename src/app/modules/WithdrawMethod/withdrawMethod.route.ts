import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { withdrawMethodController } from "./withdrawMethod.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { withdrawMethodValidation } from "./withdrawMethod.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  withdrawMethodController.getAllWithdrawMethod
);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = withdrawMethodValidation.createMethod.parse(
      JSON.parse(req.body.data)
    );
    return withdrawMethodController.insertInToDB(req, res, next);
  }
);
export const WithdrawMethodRoutes = router;
