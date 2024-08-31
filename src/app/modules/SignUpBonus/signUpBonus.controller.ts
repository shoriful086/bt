import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { signUpBonusService } from "./signUpBonus.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await signUpBonusService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Created signup bonus",
      data: result,
    });
  }
);

const getBonusData = catchAsync(async (req: Request, res: Response) => {
  const result = await signUpBonusService.getBonusData();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sign up bonus data successfully",
    data: result,
  });
});

export const signUpBonusController = {
  insertInToDB,
  getBonusData,
};
