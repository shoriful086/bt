import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { withdrawService } from "./withdraw.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await withdrawService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdraw request successful",
      data: result,
    });
  }
);

const getPendingWithdraw = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await withdrawService.getPendingWithdraw(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Pending withdraw get successful",
      data: result,
    });
  }
);

const getPaidWithdraw = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await withdrawService.getPaidWithdraw(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Paid withdraw get successful",
      data: result,
    });
  }
);

const updateWithdrawStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { withdrawId } = req.params;

    const result = await withdrawService.updateWithdrawStatus(
      user as IAuthUser,
      withdrawId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdraw paid successful",
      data: result,
    });
  }
);

export const withdrawController = {
  insertInToDB,
  getPendingWithdraw,
  getPaidWithdraw,
  updateWithdrawStatus,
};
