"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), user_controller_1.userController.getAllUserFromDB);
router.get("/my-profile", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), user_controller_1.userController.getMyProfile);
router.post("/create-user", (req, res, next) => {
    req.body = user_validation_1.userValidation.createAppUser.parse(req.body);
    return user_controller_1.userController.createUser(req, res, next);
});
router.post("/create-admin", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(req.body);
    return user_controller_1.userController.createAdmin(req, res, next);
});
router.patch("/update-profile", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), (req, res, next) => {
    req.body = user_validation_1.userValidation.updateUser.parse(req.body);
    return user_controller_1.userController.updateProfile(req, res, next);
});
router.patch("/:id/status", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = user_validation_1.userValidation.updateUserStatus.parse(req.body);
    return user_controller_1.userController.updateUserStatus(req, res, next);
});
exports.UserRoutes = router;
