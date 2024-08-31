import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import logger from "../logger/logger";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";
  let success = false;
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    success = false;
    message = "Validation error";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      success = false;
      message = `Duplicate ${err?.meta?.target}`;
      error = err.meta;
    }
  }

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    meta: err.meta, // Include metadata if available
  });

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
