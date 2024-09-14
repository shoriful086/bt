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
      message: `Payment method ${result?.name} created`,
      data: result,
    });
  }
);

const getAllPaymentMethod = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentMethodService.getAllPaymentMethod(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method fetched successfully",
      data: result,
    });
  }
);

const deletePaymentMethod = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { paymentMethodId } = req.params;
    const user = req.user;
    const result = await paymentMethodService.deletePaymentMethod(
      user as IAuthUser,
      paymentMethodId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method deleted!",
      data: result,
    });
  }
);

const createPrivateNumber = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentMethodService.createPrivateNumber(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method Created!",
      data: result,
    });
  }
);

const getPrivateNumber = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await paymentMethodService.getPrivateNumber(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method get success!",
      data: result,
    });
  }
);

const deletePrivateNumber = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    console.log(id);
    const result = await paymentMethodService.deletePrivateNumber(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Number deleted!",
      data: result,
    });
  }
);

const updatePrivateNumberCount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentMethodService.updatePrivateNumberCount(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment method update success!",
      data: result,
    });
  }
);

export const paymentMethodController = {
  createMethod,
  getAllPaymentMethod,
  deletePaymentMethod,
  createPrivateNumber,
  getPrivateNumber,
  updatePrivateNumberCount,
  deletePrivateNumber,
};
