import { DepositStatus, WithdrawStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const getMetaData = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const totalUserAndAdmin = await prisma.user.count();
  const totalAdmin = await prisma.admin.count();
  const totalUser = await prisma.appUser.count();
  const totalDepositUser = await prisma.deposit.groupBy({
    by: ["phoneNumber"],
    _count: true,
  });

  const formattedTotalDepositUser = await totalDepositUser.map((count) => ({
    count: count._count,
  }));
  // total deposit amount
  const totalDepositBalance = await prisma.deposit.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      depositStatus: DepositStatus.SUCCESS,
    },
  });

  const totalDepositAmount = totalDepositBalance._sum.amount;

  // total withdraw amount
  const totalWithdrawBalance = await prisma.withdraw.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      withdrawStatus: WithdrawStatus.PAID,
    },
  });
  const totalWithdrawAmount = totalWithdrawBalance._sum.amount;

  // get deposit data group by depositStatus
  const totalSDeposit = await prisma.deposit.groupBy({
    by: ["depositStatus"],
    _count: true,
  });

  const formattedDepositStatus = await totalSDeposit.map((count) => ({
    status: count.depositStatus,
    count: count._count,
  }));

  // get withdraw data group by withdrawStatus
  const totalSWithdraw = await prisma.withdraw.groupBy({
    by: ["withdrawStatus"],
    _count: true,
  });

  const formattedWithdrawStatus = await totalSWithdraw.map((count) => ({
    status: count.withdrawStatus,
    count: count._count,
  }));

  const totalPackagePurchase = await prisma.buyPackage.count();
  const totalCompleteTask = await prisma.completeTask.count();

  const latestTenSuccessDeposit = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.SUCCESS,
    },

    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return {
    data: latestTenSuccessDeposit,
    formattedDepositStatus,
    formattedWithdrawStatus,
    formattedTotalDepositUser,
    totalDepositAmount,
    totalWithdrawAmount,
    totalUserAndAdmin,
    totalAdmin,
    totalUser,
    totalPackagePurchase,
    totalCompleteTask,
  };
};

export const metaDataService = {
  getMetaData,
};
