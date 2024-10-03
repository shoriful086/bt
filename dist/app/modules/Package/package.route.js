"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const package_controller_1 = require("./package.controller");
const package_validation_1 = require("./package.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), package_controller_1.packageController.getAllPackage);
router.post("/create", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = package_validation_1.packageValidation.createPackage.parse(req.body);
    return package_controller_1.packageController.createPackage(req, res, next);
});
router.delete("/:packageId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), package_controller_1.packageController.deletePackage);
router.patch("/:packageId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = package_validation_1.packageValidation.updatePackage.parse(req.body);
    return package_controller_1.packageController.updatePackage(req, res, next);
});
exports.PackageRoutes = router;
