"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteTaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const completeTask_controller_1 = require("./completeTask.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), completeTask_controller_1.completeTaskController.getAllCompleteTask);
router.post("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), completeTask_controller_1.completeTaskController.insertInToDB);
exports.CompleteTaskRoutes = router;
