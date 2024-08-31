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

const deleteUser = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await appUserService.deleteUser(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
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
    const { id } = req.params;
    const user = req.user;
    const result = await appUserService.updateUser(
      user as IAuthUser,
      id,
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

export const appUserController = {
  getUserById,
  deleteUser,
  getAllUserFromDB,
  updateUser,
};
