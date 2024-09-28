import { DepositStatus, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { userSearchableField } from "./appUser.constants";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IFilterParams, IUpdateUserData } from "./appUser.interface";
import { IPaginationOptions } from "../../interfaces/iPagination";
import { IAuthUser } from "../../interfaces/auth";
import { currentAdminIsValid } from "../../../shared/currentAdmin";

const getUserById = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.appUser.findUniqueOrThrow({
    where: {
      email: userData.email,
    },
    include: {
      refer: true,
      deposit: true,
      withdraw: true,
      buyPackage: {
        include: {
          package: true,
        },
      },
      completeTask: {
        include: {
          package: true,
          user: true,
        },
      },
      luckySpins: true,
    },
  });

  return result;
};

const getAllUserFromDB = async (
  user: IAuthUser,
  params: IFilterParams,
  options: IPaginationOptions
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const { searchTerm, ...filterData } = params;
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: Prisma.AppUserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({ isDeleted: false });
  const whereCondition: Prisma.AppUserWhereInput = { AND: andConditions };

  const result = await prisma.appUser.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.appUser.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBlockedFromDB = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.appUser.findMany({
    where: {
      isDeleted: true,
    },
  });

  if (!result) {
    throw new Error("No blocked user found");
  }

  return result;
};

const blockedUser = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateUser = await tx.appUser.update({
      where: {
        email: userData.email,
      },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: updateUser.email,
      },
      data: {
        status: UserStatus.BLOCKED,
      },
    });

    return updateUser;
  });

  return result;
};

const userUnblocked = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      id,
      isDeleted: true,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateUser = await tx.appUser.update({
      where: {
        email: userData.email,
      },
      data: {
        isDeleted: false,
      },
    });

    await tx.user.update({
      where: {
        email: updateUser.email,
      },
      data: {
        status: UserStatus.ACTIVE,
      },
    });

    return updateUser;
  });

  return result;
};

const updateUser = async (
  user: IAuthUser,
  userId: string,
  payload: IUpdateUserData
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    if (payload.name || (payload.email && payload.phoneNumber)) {
      await tx.user.update({
        where: {
          email: userData.email,
        },
        data: {
          name: payload.name,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        },
      });
    }

    const updateUserData = await tx.appUser.update({
      where: {
        email: userData.email,
      },
      data: {
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        balance: payload.balance,
        depositBalance: payload.depositBalance,
      },
    });
    return updateUserData;
  });

  return result;
};

const getMyReferList = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUnique({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  if (!userData) {
    throw new Error("No user found");
  }

  const result = await prisma.appUser.findMany({
    where: {
      refererBy: userData.referrelCode,
    },

    select: {
      phoneNumber: true,
      name: true,
      deposit: {
        take: 1,
        select: {
          depositStatus: true,
        },
      },
      createdAt: true,
    },
  });
  return result;
};

const getMyDashboardData = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Get yesterday's date at 00:00:00 and 23:59:59
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const result = await prisma.$transaction(async (tx) => {
    const todayIncome = await tx.userDashboardMetaData.aggregate({
      where: {
        phoneNumber: userData?.phoneNumber,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const yesterdayIncome = await tx.userDashboardMetaData.aggregate({
      where: {
        phoneNumber: userData?.phoneNumber,
        createdAt: {
          gte: yesterday, // Greater than or equal to yesterday 00:00:00
          lt: today,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const todayEarn = todayIncome._sum.amount;
    const yesterdayEarn = yesterdayIncome._sum.amount;
    return {
      todayEarn,
      yesterdayEarn,
    };
  });

  return result;
};
export const appUserService = {
  getUserById,
  blockedUser,
  getAllUserFromDB,
  getBlockedFromDB,
  updateUser,
  userUnblocked,
  getMyReferList,
  getMyDashboardData,
};
