import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { buyPackageService } from "./buyPackage.service";

const buyPackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await buyPackageService.buyPackage(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Package purchase successfully",
      data: result,
    });
  }
);

const getMyPurchasePackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await buyPackageService.getMyPurchasePackage(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get my all purchase package",
      data: result,
    });
  }
);
const getAllPackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await buyPackageService.getAllPackage(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all purchase package",
      data: result,
    });
  }
);

export const buyPackageController = {
  buyPackage,
  getMyPurchasePackage,
  getAllPackage,
};
