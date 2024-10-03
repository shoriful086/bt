"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const withdraw_controller_1 = require("./withdraw.controller");
const router = express_1.default.Router();
router.get("/pending", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), withdraw_controller_1.withdrawController.getPendingWithdraw);
router.get("/paid", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), withdraw_controller_1.withdrawController.getPaidWithdraw);
router.post("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), withdraw_controller_1.withdrawController.insertInToDB);
router.patch("/:withdrawId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), withdraw_controller_1.withdrawController.updateWithdrawStatus);
exports.WithdrawRoutes = router;
