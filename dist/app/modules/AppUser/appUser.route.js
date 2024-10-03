"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const appUser_controller_1 = require("./appUser.controller");
const appUser_validation_1 = require("./appUser.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), appUser_controller_1.appUserController.getAllUserFromDB);
router.get("/my-dashboard-data", (0, auth_1.auth)(client_1.UserRole.APP_USER), appUser_controller_1.appUserController.getMyDashboardData);
router.get("/blocked", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), appUser_controller_1.appUserController.getBlockedFromDB);
router.get("/my-refer", (0, auth_1.auth)(client_1.UserRole.APP_USER), appUser_controller_1.appUserController.getMyReferList);
router.get("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), appUser_controller_1.appUserController.getUserById);
router.patch("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), appUser_controller_1.appUserController.userUnblocked);
router.patch("/update/:userId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = appUser_validation_1.appUserValidation.updateUserValidation.parse(req.body);
    return appUser_controller_1.appUserController.updateUser(req, res, next);
});
router.delete("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), appUser_controller_1.appUserController.blockedUser);
exports.AppUserRoutes = router;
