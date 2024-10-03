"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const paymentMethod_controller_1 = require("./paymentMethod.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const paymentMethod_validation_1 = require("./paymentMethod.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), paymentMethod_controller_1.paymentMethodController.getAllPaymentMethod);
router.get("/private-number", (0, auth_1.auth)(client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), paymentMethod_controller_1.paymentMethodController.getPrivateNumber);
router.post("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = paymentMethod_validation_1.paymentMethodValidation.createMethod.parse(JSON.parse(req.body.data));
    return paymentMethod_controller_1.paymentMethodController.createMethod(req, res, next);
});
router.post("/private-number", (0, auth_1.auth)(client_1.UserRole.DEVELOPER), paymentMethod_controller_1.paymentMethodController.createPrivateNumber);
router.delete("/:paymentMethodId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), paymentMethod_controller_1.paymentMethodController.deletePaymentMethod);
router.patch("/private-number/count-status", (0, auth_1.auth)(client_1.UserRole.APP_USER, client_1.UserRole.DEVELOPER), paymentMethod_controller_1.paymentMethodController.updatePrivateNumberCount);
router.delete("/private-number/:id", (0, auth_1.auth)(client_1.UserRole.DEVELOPER), paymentMethod_controller_1.paymentMethodController.deletePrivateNumber);
exports.PaymentMethodRoutes = router;
