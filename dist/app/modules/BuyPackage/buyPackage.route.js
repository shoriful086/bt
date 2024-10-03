"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyPackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const buyPackage_controller_1 = require("./buyPackage.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), buyPackage_controller_1.buyPackageController.getAllPackage);
router.get("/my-package", (0, auth_1.auth)(client_1.UserRole.APP_USER), buyPackage_controller_1.buyPackageController.getMyPurchasePackage);
router.post("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), buyPackage_controller_1.buyPackageController.buyPackage);
exports.BuyPackageRoutes = router;
