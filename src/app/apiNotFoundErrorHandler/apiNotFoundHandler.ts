import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const apiNotFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "api not found",
    error: {
      path: req.originalUrl,
      message: "your request api not found",
    },
  });
};

export default apiNotFoundErrorHandler;
