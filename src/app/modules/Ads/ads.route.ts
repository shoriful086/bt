import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { adsController } from "./ads.controller";
import { adsValidation } from "./ads.validation";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  adsController.getAllAdsFromDB
);
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = adsValidation.createAd.parse(req.body);
    return adsController.insertIntoDB(req, res, next);
  }
);

router.delete(
  "/:adsId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adsController.deleteAds
);

export const AdsRoutes = router;
