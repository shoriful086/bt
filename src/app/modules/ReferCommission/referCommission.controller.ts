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

const getBonusData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await referCommissionService.getBonusData(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer get successfully",
      data: result,
    });
  }
);

const deleteBonusData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await referCommissionService.deleteBonusData(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer bonus deleted!",
      data: result,
    });
  }
);

export const referCommissionController = {
  insertInToDB,
  getBonusData,
  deleteBonusData,
};
