"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const apiNotFoundErrorHandler = (req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "api not found",
        error: {
            path: req.originalUrl,
            message: "your request api not found",
        },
    });
};
exports.default = apiNotFoundErrorHandler;
