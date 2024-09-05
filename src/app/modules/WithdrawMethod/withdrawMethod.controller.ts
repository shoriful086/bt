import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { withdrawMethodService } from "./withdrawMethod.service";
import { IFileType } from "../../interfaces/fileUpload";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const file = req.file as IFileType;
    const result = await withdrawMethodService.insertInToDB(
      user as IAuthUser,
      file,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ` Withdraw method ${result.name} created`,
      data: result,
    });
  }
);

const getAllWithdrawMethod = catchAsync(async (req: Request, res: Response) => {
  const result = await withdrawMethodService.getAllWithdrawMethod();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdraw method fetched successfully",
    data: result,
  });
});

const deleteWithdrawMethod = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { withdrawId } = req.params;
    const user = req.user;
    const result = await withdrawMethodService.deleteWithdrawMethod(
      user as IAuthUser,
      withdrawId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdraw method deleted!",
      data: result,
    });
  }
);

export const withdrawMethodController = {
  insertInToDB,
  getAllWithdrawMethod,
  deleteWithdrawMethod,
};
