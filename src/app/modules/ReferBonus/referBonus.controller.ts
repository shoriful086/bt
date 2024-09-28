import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { referBonusService } from "./referBonus.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await referBonusService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer bonus created!",
      data: result,
    });
  }
);
const getDataFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await referBonusService.getDataFromDB(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer bonus get!",
      data: result,
    });
  }
);

const getReferBonusData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await referBonusService.getReferBonusData(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get refer bonus!",
      data: result,
    });
  }
);
const getMyRewardData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await referBonusService.getMyRewardData(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get refer bonus!",
      data: result,
    });
  }
);

export const referBonusController = {
  insertInToDB,
  getReferBonusData,
  getDataFromDB,
  getMyRewardData,
};
