import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { betService } from "./bet.service";

const createBet = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await betService.createBet(user as IAuthUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Spin accepted",
      data: result,
    });
  }
);

const getMyLastSpinBet = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await betService.getMyLastSpinBet(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get success",
      data: result,
    });
  }
);

export const betController = {
  createBet,
  getMyLastSpinBet,
};
