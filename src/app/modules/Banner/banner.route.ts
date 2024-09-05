import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { bannerController } from "./banner.controller";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.APP_USER),
  bannerController.getAllBannerImage
);

router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  bannerController.insertInToDB
);

router.delete(
  "/:bannerId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  bannerController.deleteBanner
);

export const BannerRoutes = router;
