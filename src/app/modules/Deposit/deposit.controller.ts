import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { depositService } from "./deposit.service";
import { IAuthUser } from "../../interfaces/auth";
import pick from "../../../shared/pick";
import { depositFilterableField } from "./deposit.constant";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await depositService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deposit added successful",
      data: result,
    });
  }
);

const getAllDepositData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filter = pick(req.query, depositFilterableField);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await depositService.getAllDepositData(
      user as IAuthUser,
      filter,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All deposit data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getPendingDeposit = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await depositService.getPendingDeposit(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get pending deposit fetched",
      data: result,
    });
  }
);

const getSuccessDeposit = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await depositService.getSuccessDeposit(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get success deposit fetched",
      data: result,
    });
  }
);

const updateDepositStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { depositId } = req.params;
    const user = req.user;
    const result = await depositService.updateDepositStatus(
      user as IAuthUser,
      depositId,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Deposit ${result.depositStatus}`,
      data: result,
    });
  }
);

const depositBonus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await depositService.depositBonus(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Deposit bonus created`,
      data: result,
    });
  }
);

export const depositController = {
  insertInToDB,
  getAllDepositData,
  getPendingDeposit,
  getSuccessDeposit,
  updateDepositStatus,
  depositBonus,
};
