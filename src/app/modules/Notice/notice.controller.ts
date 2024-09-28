import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { noticeService } from "./notice.service";

const insertInToDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await noticeService.insertInToDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "notice created!",
      data: result,
    });
  }
);
const getNotice = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await noticeService.getNotice(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "notice data get",
      data: result,
    });
  }
);
const deleteNotice = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await noticeService.deleteNotice(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "notice deleted!",
      data: result,
    });
  }
);

export const noticeController = {
  insertInToDB,
  getNotice,
  deleteNotice,
};
