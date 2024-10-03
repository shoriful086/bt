"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetReferBonusRoute = void 0;
const express_1 = __importDefault(require("express"));
const targetReferBonus_controller_1 = require("./targetReferBonus.controller");
const client_1 = require("@prisma/client");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), targetReferBonus_controller_1.targetReferBonusController.getAllFromDB);
router.get("/my-claimed-data", (0, auth_1.auth)(client_1.UserRole.APP_USER), targetReferBonus_controller_1.targetReferBonusController.getMyReferClaimedData);
router.post("/create", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), targetReferBonus_controller_1.targetReferBonusController.insertInToDB);
router.post("/claim-bonus", (0, auth_1.auth)(client_1.UserRole.APP_USER), targetReferBonus_controller_1.targetReferBonusController.claimTargetReferBonus);
router.delete("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), targetReferBonus_controller_1.targetReferBonusController.deleteTargetReferBonusData);
exports.TargetReferBonusRoute = router;
