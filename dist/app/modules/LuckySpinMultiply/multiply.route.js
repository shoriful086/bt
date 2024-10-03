"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplyRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const multiply_controller_1 = require("./multiply.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), multiply_controller_1.multiplyController.getAllMultiplyData);
router.post("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), multiply_controller_1.multiplyController.insertIntoDB);
exports.MultiplyRoutes = router;
