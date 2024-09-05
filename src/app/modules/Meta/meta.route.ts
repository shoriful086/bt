import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { metaController } from "./meta.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  metaController.getMetaData
);

export const MetaDataRoutes = router;
