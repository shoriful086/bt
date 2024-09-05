import {
  AppUser,
  Prisma,
  ReferStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { IAdmin, IAppUser, IFilterParams } from "./user.interface";
import { IAuthUser } from "../../interfaces/auth";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { userSearchableField } from "./user.constants";
import { IPaginationOptions } from "../../interfaces/iPagination";
import { any } from "zod";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import checkReferCodeAndCreateRefer from "../../../helpers/checkReferCodeIsValis";

const createUser = async (payload: IAppUser): Promise<AppUser> => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const referralCode = Math.floor(100000 + Math.random() * 900000).toString();
  // check user is already exist
  const isUserExists = await prisma.user.findUnique({
    where: {
      phoneNumber: payload?.appUser?.phoneNumber,
    },
  });

  if (isUserExists) {
    throw new Error("User already exist");
  }

  // create appUser and refer
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.appUser.name,
        phoneNumber: payload.appUser.phoneNumber,
        email: payload.appUser.email,
        password: hashedPassword,
        role: UserRole.APP_USER,
        status: UserStatus.ACTIVE,
      },
    });

    const signUpBonusData = await tx.signUpBonus.findFirst();

    const newUser = await tx.appUser.create({
      data: {
        name: payload.appUser.name,
        phoneNumber: user.phoneNumber,
        email: payload.appUser.email,
        balance: signUpBonusData?.bonusAmount ? signUpBonusData.bonusAmount : 0,
        depositBalance: 0,
        referIncome: 0,
        earnedForAd: 0,
        referrelCode: referralCode,
        refererBy: payload.appUser.refererBy,
        referLink: `https://btpay.com/register?referral=${referralCode}`,
      },
    });

    await checkReferCodeAndCreateRefer(payload);

    return newUser;
  });
  return result;
};

const createAdmin = async (user: IAuthUser, payload: IAdmin) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload?.admin?.email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exist");
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.admin.name,
        phoneNumber: payload.admin.phoneNumber,
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    const newAdmin = await tx.admin.create({
      data: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });

    return newAdmin;
  });
  return result;
};

const updateProfile = async (user: IAuthUser, payload: { name: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new Error("User not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    let updateUser;
    if (user.role === UserRole.APP_USER) {
      await tx.user.update({
        where: {
          phoneNumber: userData.phoneNumber,
        },
        data: {
          name: payload.name,
        },
      });
      updateUser = await prisma.appUser.update({
        where: {
          phoneNumber: userData.phoneNumber,
        },
        data: {
          name: payload.name,
        },
      });
    } else {
      await tx.user.update({
        where: {
          phoneNumber: userData.phoneNumber,
        },
        data: {
          name: payload.name,
        },
      });
      updateUser = await prisma.admin.update({
        where: {
          phoneNumber: userData.phoneNumber,
        },
        data: {
          name: payload.name,
        },
      });
    }

    return updateUser;
  });

  return result;
};

const updateUserStatus = async (
  user: IAuthUser,
  id: string,
  payload: { status: UserStatus }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });
  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const getMyProfile = async (user: IAuthUser) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  let profileInfo;
  if (user.role === UserRole.APP_USER) {
    profileInfo = await prisma.appUser.findUnique({
      where: {
        email: userData.email,
        isDeleted: false,
      },
      include: {
        refer: true,
        deposit: true,
        withdraw: {
          orderBy: {
            createdAt: "desc",
          },
        },
        buyPackage: {
          include: {
            package: true,
          },
        },
      },
    });
  } else {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  }

  return profileInfo;
};

const getAllUserFromDB = async (
  user: IAuthUser,
  params: IFilterParams,
  options: IPaginationOptions
) => {
  // check admin running query time active
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const { searchTerm, ...filterData } = params;
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: Prisma.UserWhereInput[] = [];

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
  const whereCondition: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.user.count({
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

export const userService = {
  createUser,
  createAdmin,
  updateProfile,
  updateUserStatus,
  getMyProfile,
  getAllUserFromDB,
};
