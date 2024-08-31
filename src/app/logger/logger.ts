// logger.ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Default logging level
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "user-service" }, // Optional: add some default meta data
  transports: [
    new transports.File({ filename: "error.log", level: "error" }), // Error log file
    new transports.File({ filename: "combined.log" }), // Combined log file
  ],
});

// If we're not in production then log to the `console` with the simple format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
