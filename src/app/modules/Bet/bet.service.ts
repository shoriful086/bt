import { DepositStatus } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const createBet = async (user: IAuthUser, payload: { amount: any }) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  if (userData?.balance < payload.amount) {
    throw new Error("Balance is low");
  }

  const isDeposit = await prisma.deposit.findFirst({
    where: {
      phoneNumber: userData?.phoneNumber,
      depositStatus: DepositStatus.SUCCESS,
    },
  });

  if (!isDeposit) {
    throw new Error("Please add balance and play spin");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updateUserBalance = await tx.appUser.update({
      where: {
        phoneNumber: userData.phoneNumber,
      },
      data: {
        balance: userData?.balance - payload.amount,
      },
    });

    const createBet = await tx.bet.create({
      data: {
        userNumber: updateUserBalance?.phoneNumber,
        amount: payload.amount,
      },
    });
    return createBet;
  });

  return result;
};

const getMyLastSpinBet = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  const result = await prisma.bet.findFirst({
    where: {
      userNumber: userData?.phoneNumber,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
export const betService = {
  createBet,
  getMyLastSpinBet,
};
