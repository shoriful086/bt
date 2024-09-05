import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { metaDataService } from "./meta.service";

const getMetaData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await metaDataService.getMetaData(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data get successfully",
      data: result,
    });
  }
);

export const metaController = { getMetaData };
