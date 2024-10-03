"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferBonusRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const referBonus_controller_1 = require("./referBonus.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), referBonus_controller_1.referBonusController.getDataFromDB);
router.get("/get-reward", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), referBonus_controller_1.referBonusController.getReferBonusData);
router.get("/my-bonus", (0, auth_1.auth)(client_1.UserRole.APP_USER), referBonus_controller_1.referBonusController.getMyRewardData);
router.post("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), referBonus_controller_1.referBonusController.insertInToDB);
exports.ReferBonusRoutes = router;
