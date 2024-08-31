import { DepositStatus, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { IPaginationOptions } from "../../interfaces/iPagination";
import { ICreatedDeposit, IFilterParams } from "./deposit.interface";
import { depositSearchableField } from "./deposit.constant";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { sendMessageTelegramBot } from "../../../helpers/sendMessageTelegramBot";
import { dateFormat } from "../../../helpers/dateFormat";
import ApiError from "../../erros/apiError";
import httpStatus from "http-status";

const insertInToDB = async (user: IAuthUser, payload: ICreatedDeposit) => {
  // check trxId
  const checkIsDataExists = await prisma.deposit.findFirst({
    where: {
      trxId: payload.trxId,
    },
  });

  if (checkIsDataExists) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, "Invalid trxId");
  }

  // check user is valid
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  // check method is valid
  const methodData = await prisma.paymentMethod.findFirstOrThrow({
    where: {
      name: {
        equals: payload.paymentMethod,
        mode: "insensitive",
      },
    },
  });

  const amount = parseFloat(payload.amount);
  const minPayment = parseFloat(methodData.minPayment);

  // Check if amount is less than minPayment
  if (amount < minPayment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Minimum ${methodData.name} payment is ${minPayment} BDT`
    );
  }

  // check trx id length
  const name = payload.paymentMethod.toLowerCase();
  let maxLength;
  if (name === "nagad") {
    maxLength = 8;
  } else if (name === "bkash") {
    maxLength = 10;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid service provider");
  }

  if (payload.trxId.length !== maxLength) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Transaction id must be ${maxLength} character`
    );
  }

  // finally create deposit data
  const result = await prisma.deposit.create({
    data: {
      phoneNumber: userData.phoneNumber,
      paymentNumber: payload.paymentNumber,
      paymentMethod: methodData.name,
      amount: parseFloat(payload.amount),
      trxId: payload.trxId,
    },
  });

  const nowTime = new Date(Date.now());

  const formattedTime = await dateFormat(nowTime);
  const message = `
  🔔*Deposit Request Successfully Processed
   Method: ${methodData.name}
   User: ${userData.phoneNumber}
   Payment Number: ${payload.paymentNumber}
   Amount: ${payload.amount}
   Trx ID: ${payload.trxId}
   Time: ${formattedTime}
  `;
  await sendMessageTelegramBot(message);
  return result;
};

const getAllDepositData = async (
  user: IAuthUser,
  params: IFilterParams,
  options: IPaginationOptions
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const { searchTerm, ...filterData } = params;

  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: Prisma.DepositWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: depositSearchableField.map((field) => ({
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
  const whereCondition: Prisma.DepositWhereInput = { AND: andConditions };

  const result = await prisma.deposit.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.deposit.count({
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

const getPendingDeposit = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.PENDING,
    },
  });
  if (!result) {
    throw new Error("no pending deposit data");
  }
  return result;
};

const getSuccessDeposit = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.SUCCESS,
    },
  });
  if (!result) {
    throw new Error("no success deposit data");
  }
  return result;
};

const depositBonus = async (
  user: IAuthUser,
  payload: { depositBonus: number }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const bonusData = await prisma.depositBonus.findFirst();
  if (bonusData) {
    throw new Error("Deposit bonus already added");
  }
  const result = await prisma.depositBonus.create({
    data: {
      depositBonus: payload.depositBonus,
    },
  });

  return result;
};

const updateDepositStatus = async (
  user: IAuthUser,
  depositId: string,
  payload: { depositStatus: DepositStatus }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  // check deposit id in valid
  const depositData = await prisma.deposit.findUniqueOrThrow({
    where: {
      id: depositId,
      depositStatus: DepositStatus.PENDING,
    },
  });

  // check deposit user is valid
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: depositData.phoneNumber,
    },
  });

  // calculate refer commission
  const getReferBonusData = await prisma.referCommission.findFirst();

  const referCommission =
    (depositData.amount * getReferBonusData!.commissionBonus) / 100;

  // final result
  const result = await prisma.$transaction(async (tx) => {
    let updateDepositUser;

    // process payment
    if (payload.depositStatus === DepositStatus.REJECTED) {
      // update deposit status is rejected
      updateDepositUser = await tx.deposit.update({
        where: {
          id: depositData.id,
        },
        data: {
          depositStatus: DepositStatus.REJECTED,
        },
      });
    } else {
      updateDepositUser = await tx.deposit.update({
        where: {
          id: depositData.id,
        },
        data: {
          depositStatus: DepositStatus.SUCCESS,
        },
      });

      // added deposit bonus
      const deposit = await prisma.depositBonus.findFirst();
      let bonus = 0;
      if (deposit && depositData.amount >= 1000) {
        bonus = deposit.depositBonus;
      }

      // update current deposit user balance
      await tx.appUser.update({
        where: {
          phoneNumber: userData.phoneNumber,
        },
        data: {
          balance: userData.balance + depositData.amount + bonus!,
          depositBalance: userData.depositBalance + depositData.amount,
        },
      });

      // update if current deposit user which used refer code
      if (userData.refererBy) {
        const depositUser = await prisma.appUser.findFirst({
          where: {
            referrelCode: userData.refererBy,
          },
        });
        await tx.appUser.update({
          where: {
            phoneNumber: depositUser?.phoneNumber,
          },
          data: {
            balance: depositUser!.balance + referCommission,
            referIncome: depositUser!.referIncome + referCommission,
          },
        });
      }
    }

    return updateDepositUser;
  });

  return result;
};
export const depositService = {
  insertInToDB,
  getAllDepositData,
  getPendingDeposit,
  getSuccessDeposit,
  updateDepositStatus,
  depositBonus,
};
