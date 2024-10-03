"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawMethodRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const withdrawMethod_controller_1 = require("./withdrawMethod.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const withdrawMethod_validation_1 = require("./withdrawMethod.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), withdrawMethod_controller_1.withdrawMethodController.getAllWithdrawMethod);
router.post("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = withdrawMethod_validation_1.withdrawMethodValidation.createMethod.parse(JSON.parse(req.body.data));
    return withdrawMethod_controller_1.withdrawMethodController.insertInToDB(req, res, next);
});
router.delete("/:withdrawId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), withdrawMethod_controller_1.withdrawMethodController.deleteWithdrawMethod);
exports.WithdrawMethodRoutes = router;
