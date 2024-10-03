"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger.ts
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "info", // Default logging level
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "user-service" }, // Optional: add some default meta data
    transports: [
        new winston_1.transports.File({ filename: "error.log", level: "error" }), // Error log file
        new winston_1.transports.File({ filename: "combined.log" }), // Combined log file
    ],
});
// If we're not in production then log to the `console` with the simple format
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
}
exports.default = logger;
