import { UserRole } from "@prisma/client";
import express from "express";
import { auth } from "../../middlewares/auth";
import { noticeController } from "./notice.controller";
const router = express.Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DEVELOPER,
    UserRole.APP_USER
  ),
  noticeController.getNotice
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  noticeController.insertInToDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEVELOPER),
  noticeController.deleteNotice
);
export const NoticeRoutes = router;
