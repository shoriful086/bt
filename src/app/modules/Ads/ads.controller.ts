import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { adsService } from "./ads.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await adsService.insertIntoDB(user as IAuthUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ads created!",
      data: result,
    });
  }
);

const getAllAdsFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await adsService.getAllAdsFromDB(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all ads",
      data: result,
    });
  }
);

const deleteAds = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { adsId } = req.params;
    const result = await adsService.deleteAds(user as IAuthUser, adsId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ads deleted!",
      data: result,
    });
  }
);

export const adsController = {
  insertIntoDB,
  getAllAdsFromDB,
  deleteAds,
};
