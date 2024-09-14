import httpStatus from "http-status";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../erros/apiError";
import { IAuthUser } from "../../interfaces/auth";
import { UserRole, UserStatus } from "@prisma/client";
import { IPackage } from "./package.interface";

const createPackage = async (user: IAuthUser, payload: IPackage) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const packageData = await prisma.package.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (packageData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${packageData.name} package already exist`
    );
  }

  const result = await prisma.package.create({
    data: payload,
  });
  return result;
};

const getAllPackage = async (user: IAuthUser) => {
  if (user?.role !== UserRole.APP_USER) {
    await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  }
  const userData = await prisma.user.findUnique({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new Error("User not found");
  }

  if (user.role === UserRole.APP_USER) {
    const userData = await prisma.appUser.findUnique({
      where: {
        phoneNumber: user.phoneNumber,
        isDeleted: false,
      },
    });

    if (!userData) {
      throw new ApiError(httpStatus.NOT_FOUND, "Your account not found");
    }
  }

  const result = await prisma.package.findMany({
    orderBy: {
      price: "asc",
    },
  });
  return result;
};

const deletePackage = async (user: IAuthUser, packageId: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const packageData = await prisma.package.findUnique({
    where: {
      id: packageId,
    },
  });

  if (!packageData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  const result = await prisma.package.delete({
    where: {
      id: packageId,
    },
  });

  return result;
};

const updatePackage = async (
  user: IAuthUser,
  packageId: string,
  payload: any
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const packageData = await prisma.package.findUniqueOrThrow({
    where: {
      id: packageId,
    },
  });
  const result = await prisma.package.update({
    where: {
      id: packageData?.id,
    },
    data: payload,
  });
  return result;
};

export const packageService = {
  createPackage,
  getAllPackage,
  deletePackage,
  updatePackage,
};
