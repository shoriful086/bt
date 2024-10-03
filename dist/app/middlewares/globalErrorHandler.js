"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const logger_1 = __importDefault(require("../logger/logger"));
const globalErrorHandler = (err, req, res, next) => {
    var _a;
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong";
    let success = false;
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        success = false;
        message = "Validation error";
        error = err.message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            success = false;
            message = `Duplicate ${(_a = err === null || err === void 0 ? void 0 : err.meta) === null || _a === void 0 ? void 0 : _a.target}`;
            error = err.meta;
        }
    }
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        meta: err.meta, // Include metadata if available
    });
    res.json({
        success,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
