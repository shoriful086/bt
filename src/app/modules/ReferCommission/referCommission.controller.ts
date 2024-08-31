import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { referCommissionService } from "./referCommission.service";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await referCommissionService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer commission added successfully",
      data: result,
    });
  }
);

export const referCommissionController = {
  insertInToDB,
};
