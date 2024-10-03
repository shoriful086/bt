"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const bet_controller_1 = require("./bet.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), bet_controller_1.betController.getMyLastSpinBet);
router.post("/", (0, auth_1.auth)(client_1.UserRole.APP_USER), bet_controller_1.betController.createBet);
exports.BetRoutes = router;
