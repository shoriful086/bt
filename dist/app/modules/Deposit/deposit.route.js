"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const deposit_controller_1 = require("./deposit.controller");
const deposit_validation_1 = require("./deposit.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.getAllDepositData);
router.get("/bonus", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.getBonusData);
router.get("/pending", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.getPendingDeposit);
router.get("/success", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.getSuccessDeposit);
router.get("/rejected", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.getRejectedDeposit);
router.post("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), (req, res, next) => {
    req.body = deposit_validation_1.depositValidation.createDeposit.parse(req.body);
    return deposit_controller_1.depositController.insertInToDB(req, res, next);
});
router.post("/bonus", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = deposit_validation_1.depositValidation.depositBonus.parse(req.body);
    return deposit_controller_1.depositController.depositBonus(req, res, next);
});
router.patch("/:depositId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = deposit_validation_1.depositValidation.updateDeposit.parse(req.body);
    return deposit_controller_1.depositController.updateDepositStatus(req, res, next);
});
router.delete("/bonus/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), deposit_controller_1.depositController.deleteBonusData);
exports.DepositRoutes = router;
