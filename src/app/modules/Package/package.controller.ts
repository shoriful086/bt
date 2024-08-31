import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { packageService } from "./package.service";

const createPackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await packageService.createPackage(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Package created successful",
      data: result,
    });
  }
);

const getAllPackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await packageService.getAllPackage(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all packages successful",
      data: result,
    });
  }
);

const deletePackage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { packageId } = req.params;
    const result = await packageService.deletePackage(
      user as IAuthUser,
      packageId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all packages successful",
      data: result,
    });
  }
);

export const packageController = {
  createPackage,
  getAllPackage,
  deletePackage,
};
