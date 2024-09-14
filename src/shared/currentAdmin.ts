import { UserRole, UserStatus } from "@prisma/client";
import { IAuthUser } from "../app/interfaces/auth";
import ApiError from "../app/erros/apiError";
import httpStatus from "http-status";

export const currentAdminIsValid = async (user: IAuthUser, table: any) => {
  const adminData = await table({
    where: {
      phoneNumber: user?.phoneNumber,
      // status: UserStatus.ACTIVE,
      // role: UserRole.SUPER_ADMIN || UserRole.ADMIN,
    },
  });

  if (
    adminData?.role !== UserRole.SUPER_ADMIN &&
    adminData?.role !== UserRole.ADMIN &&
    adminData?.role !== UserRole.DEVELOPER
  ) {
    throw new Error("You do not have access data");
  }

  if (adminData?.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }
  if (adminData?.status === UserStatus.DELETED) {
    throw new Error("Your account has been deleted");
  }

  if (!adminData) {
    throw new Error("Your are not authorized");
  }
};
