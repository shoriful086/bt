import httpStatus from "http-status";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/auth";
import pick from "../../../shared/pick";
import { userFilterableField } from "./user.constants";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.createAdmin(user as IAuthUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "admin created successfully",
      data: result,
    });
  }
);

const updateProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.updateProfile(user as IAuthUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await userService.updateUserStatus(
      user as IAuthUser,
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.getMyProfile(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile data fetched",
      data: result,
    });
  }
);

const getAllUserFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filter = pick(req.query, userFilterableField);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await userService.getAllUserFromDB(
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
export const userController = {
  createUser,
  createAdmin,
  updateProfile,
  updateUserStatus,
  getMyProfile,
  getAllUserFromDB,
};
