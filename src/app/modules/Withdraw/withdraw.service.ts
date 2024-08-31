import { DepositStatus, WithdrawStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { IMethodData } from "./withdraw.interface";
import { dateFormat } from "../../../helpers/dateFormat";
import { sendMessageTelegramBot } from "../../../helpers/sendMessageTelegramBot";

const insertInToDB = async (user: IAuthUser, payload: IMethodData) => {
  // check user
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  // check method is valid
  const methodData = await prisma.withdrawMethod.findFirstOrThrow({
    where: {
      name: {
        equals: payload.paymentMethod,
        mode: "insensitive",
      },
    },
  });

  if (userData && userData.balance < payload.amount) {
    throw new Error("balance not sufficient");
  }

  if (payload.amount < parseFloat(methodData.minPayment)) {
    throw new Error(
      `Minimum ${methodData.name} withdraw ${methodData.minPayment} BDT`
    );
  }

  if (userData) {
    const depositData = await prisma.deposit.findFirst({
      where: {
        phoneNumber: userData.phoneNumber,
        depositStatus: DepositStatus.SUCCESS,
      },
    });

    if (!depositData) {
      throw new Error(
        "Please minimum 1 time deposit, then you will get withdraw"
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const createWithdraw = await tx.withdraw.create({
      data: {
        phoneNumber: userData.phoneNumber,
        paymentReceivedNumber: payload.paymentReceivedNumber,
        paymentMethod: payload.paymentMethod,
        amount: payload.amount,
      },
    });

    const nowTime = new Date(Date.now());

    const formattedTime = await dateFormat(nowTime);
    const message = `
    🔔*Withdraw Request Successfully Processed
     Method: ${methodData.name}
     User: ${userData.phoneNumber}
     Payment Number: ${payload.paymentReceivedNumber}
     Amount: ${payload.amount}
     Time: ${formattedTime}
    `;
    await sendMessageTelegramBot(message);

    await tx.appUser.update({
      where: {
        phoneNumber: userData.phoneNumber,
      },
      data: {
        balance: userData.balance - payload.amount,
      },
    });

    return createWithdraw;
  });
  return result;
};

const getPendingWithdraw = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUniqueOrThrow);

  const result = await prisma.withdraw.findMany({
    where: {
      withdrawStatus: WithdrawStatus.PENDING,
    },
  });
  if (result.length === 0) {
    throw new Error("No withdraw data pending");
  }

  return result;
};

const getPaidWithdraw = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUniqueOrThrow);

  const result = await prisma.withdraw.findMany({
    where: {
      withdrawStatus: WithdrawStatus.PAID,
    },
  });
  if (result.length === 0) {
    throw new Error("No withdraw data paid");
  }

  return result;
};

const updateWithdrawStatus = async (user: IAuthUser, withdrawId: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUniqueOrThrow);
  const withdrawData = await prisma.withdraw.findUnique({
    where: {
      id: withdrawId,
      withdrawStatus: WithdrawStatus.PENDING,
    },
  });

  if (!withdrawData) {
    throw new Error("No withdraw pending");
  }

  const result = await prisma.withdraw.update({
    where: {
      id: withdrawData.id,
    },
    data: {
      withdrawStatus: WithdrawStatus.PAID,
    },
  });
  return result;
};

export const withdrawService = {
  insertInToDB,
  getPendingWithdraw,
  getPaidWithdraw,
  updateWithdrawStatus,
};
