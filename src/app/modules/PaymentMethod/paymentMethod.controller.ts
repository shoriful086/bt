import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paymentMethodService } from "./paymentMethod.service";
import { IFileType } from "../../interfaces/fileUpload";
import { IAuthUser } from "../../interfaces/auth";

const createMethod = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentMethodService.createMethod(
      user as IAuthUser,
      req.file as IFileType,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method created successfully",
      data: result,
    });
  }
);

const getAllPaymentMethod = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentMethodService.getAllPaymentMethod();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment method fetched successfully",
    data: result,
  });
});

export const paymentMethodController = {
  createMethod,
  getAllPaymentMethod,
};
