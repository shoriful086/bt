import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { authService } from "./auth.service";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";
import { IAuthUser } from "../../interfaces/auth";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "logged in successfully",
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await authService.changePassword(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password change successfully",
      data: result,
    });
  }
);

export const authController = {
  loginAdmin,
  loginUser,
  changePassword,
};
