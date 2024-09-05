import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { bannerService } from "./banner.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await bannerService.insertInToDB(user as IAuthUser, req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Banner Added!",
      data: result,
    });
  }
);
const getAllBannerImage = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await bannerService.getAllBannerImage(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Banner data fetched!",
      data: result,
    });
  }
);

const deleteBanner = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { bannerId } = req.params;
    const result = await bannerService.deleteBanner(
      user as IAuthUser,
      bannerId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Banner deleted!",
      data: result,
    });
  }
);

export const bannerController = {
  insertInToDB,
  getAllBannerImage,
  deleteBanner,
};
