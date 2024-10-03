"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_contorller_1 = require("./auth.contorller");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/user-login", auth_contorller_1.authController.loginUser);
router.post("/admin-login", auth_contorller_1.authController.loginAdmin);
router.patch("/change-password", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), auth_contorller_1.authController.changePassword);
exports.AuthRoutes = router;
