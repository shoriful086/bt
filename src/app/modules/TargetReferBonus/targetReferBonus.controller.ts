import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { targetReferBonusService } from "./targetReferBonus.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await targetReferBonusService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "created!",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await targetReferBonusService.getAllFromDB(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get success!",
      data: result,
    });
  }
);

const claimTargetReferBonus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await targetReferBonusService.claimTargetReferBonus(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claim success!",
      data: result,
    });
  }
);

const getMyReferClaimedData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await targetReferBonusService.getMyReferClaimedData(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claim success!",
      data: result,
    });
  }
);

const deleteTargetReferBonusData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await targetReferBonusService.deleteTargetReferBonusData(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deleted!",
      data: result,
    });
  }
);
export const targetReferBonusController = {
  insertInToDB,
  getAllFromDB,
  claimTargetReferBonus,
  getMyReferClaimedData,
  deleteTargetReferBonusData,
};
