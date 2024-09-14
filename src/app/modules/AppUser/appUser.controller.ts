import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/auth";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { appUserService } from "./appUser.service";
import pick from "../../../shared/pick";
import { userSearchableField } from "./appUser.constants";

const getUserById = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await appUserService.getUserById(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user data fetched",
      data: result,
    });
  }
);

const blockedUser = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await appUserService.blockedUser(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${result.name} blocked`,
      data: result,
    });
  }
);

const getBlockedFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await appUserService.getBlockedFromDB(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All blocked data fetched",
      data: result,
    });
  }
);

const userUnblocked = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await appUserService.userUnblocked(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${result.name} unblocked`,
      data: result,
    });
  }
);

const getAllUserFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filter = pick(req.query, userSearchableField);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await appUserService.getAllUserFromDB(
      user as IAuthUser,
      filter,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { userId } = req.params;
    const user = req.user;
    const result = await appUserService.updateUser(
      user as IAuthUser,
      userId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Updated successfully",
      data: result,
    });
  }
);

const getMyReferList = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await appUserService.getMyReferList(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refer get successfully",
      data: result,
    });
  }
);

const getMyDashboardData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await appUserService.getMyDashboardData(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Dashboard data get success",
      data: result,
    });
  }
);

export const appUserController = {
  getUserById,
  blockedUser,
  getAllUserFromDB,
  updateUser,
  getBlockedFromDB,
  userUnblocked,
  getMyReferList,
  getMyDashboardData,
};
