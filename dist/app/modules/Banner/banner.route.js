"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const banner_controller_1 = require("./banner.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), banner_controller_1.bannerController.getAllBannerImage);
router.post("/create", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), fileUploader_1.fileUploader.upload.single("file"), banner_controller_1.bannerController.insertInToDB);
router.delete("/:bannerId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), banner_controller_1.bannerController.deleteBanner);
exports.BannerRoutes = router;
