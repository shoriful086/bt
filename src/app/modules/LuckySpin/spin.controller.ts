import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { spinService } from "./spin.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await spinService.insertInToDB(user as IAuthUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Balance added",
      data: result,
    });
  }
);

const getAllSpin = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await spinService.getAllSpin(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Spin get success",
      data: result,
    });
  }
);

export const spinController = {
  insertInToDB,
  getAllSpin,
};
