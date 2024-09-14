import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paymentNotice } from "./paymentService";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentNotice.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment notice created successfully",
      data: result,
    });
  }
);

const getAllPaymentNotice = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentNotice.getAllPaymentNotice(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment notice get successfully",
      data: result,
    });
  }
);

const deleteNotice = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { noticeId } = req.params;
    const result = await paymentNotice.deleteNotice(
      user as IAuthUser,
      noticeId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment notice deleted!",
      data: result,
    });
  }
);

export const paymentNoticeController = {
  insertInToDB,
  getAllPaymentNotice,
  deleteNotice,
};
