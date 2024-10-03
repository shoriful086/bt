import { DepositStatus, WithdrawStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const getMetaData = async (user: IAuthUser, date: any) => {
  console.log(user);
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  console.log(user);
  if (date?.date === "todays") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(today.getHours() + 6);
    return todayMetaData(today.toISOString());
  }
  if (date?.date === "yesterday") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(today.getHours() + 6);

    // yesterday date get
    const todays = new Date();
    todays.setHours(0, 0, 0, 0);
    todays.setHours(todays.getHours() + 6);
    const yesterday = new Date(todays);

    yesterday.setDate(todays.getDate() - 1);
    return yesterdayMetaData(yesterday.toISOString(), today.toISOString());
  }
  if (date?.date === "lastSevenDays") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(today.getHours() + 6);

    // yesterday date get
    const lastSevenDay = new Date();
    lastSevenDay.setHours(0, 0, 0, 0);
    lastSevenDay.setHours(lastSevenDay.getHours() + 6);
    const lastSevenDays = new Date(lastSevenDay);

    lastSevenDays.setDate(lastSevenDay.getDate() - 7);
    return lastSevenDaysMetaData(
      lastSevenDays.toISOString(),
      today.toISOString()
    );
  }
  return totalMetaData();
};

// today data
const todayMetaData = async (today: any) => {
  const totalUser = await prisma.appUser.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
  const totalDepositUser = await prisma.deposit.groupBy({
    by: ["phoneNumber"],
    _count: true,
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const formattedTotalDepositUser = totalDepositUser.length;
  // total deposit amount
  const totalDepositBalance = await prisma.deposit.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: today,
      },
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
      createdAt: {
        gte: today,
      },
    },
  });
  const totalWithdrawAmount = totalWithdrawBalance._sum.amount;

  // get deposit data group by depositStatus
  const totalSDeposit = await prisma.deposit.groupBy({
    by: ["depositStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const formattedDepositStatus = await totalSDeposit.map((count) => ({
    status: count.depositStatus,
    count: count._count,
  }));

  // get withdraw data group by withdrawStatus
  const totalSWithdraw = await prisma.withdraw.groupBy({
    by: ["withdrawStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const formattedWithdrawStatus = await totalSWithdraw.map((count) => ({
    status: count.withdrawStatus,
    count: count._count,
  }));

  const totalPackagePurchase = await prisma.buyPackage.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
  const totalCompleteTask = await prisma.completeTask.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const latestTenSuccessDeposit = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: today,
      },
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
    totalUser,
    totalPackagePurchase,
    totalCompleteTask,
  };
};

// yesterdayMetaData
const yesterdayMetaData = async (yesterday: any, today: any) => {
  const totalUser = await prisma.appUser.count({
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });
  const totalDepositUser = await prisma.deposit.groupBy({
    by: ["phoneNumber"],
    _count: true,
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });

  const formattedTotalDepositUser = totalDepositUser.length;
  // total deposit amount
  const totalDepositBalance = await prisma.deposit.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
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
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });
  const totalWithdrawAmount = totalWithdrawBalance._sum.amount;

  // get deposit data group by depositStatus
  const totalSDeposit = await prisma.deposit.groupBy({
    by: ["depositStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });

  const formattedDepositStatus = await totalSDeposit.map((count) => ({
    status: count.depositStatus,
    count: count._count,
  }));

  // get withdraw data group by withdrawStatus
  const totalSWithdraw = await prisma.withdraw.groupBy({
    by: ["withdrawStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });

  const formattedWithdrawStatus = await totalSWithdraw.map((count) => ({
    status: count.withdrawStatus,
    count: count._count,
  }));

  const totalPackagePurchase = await prisma.buyPackage.count({
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });
  const totalCompleteTask = await prisma.completeTask.count({
    where: {
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
    },
  });

  const latestTenSuccessDeposit = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: yesterday, // From the start of yesterday
        lt: today,
      },
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
    totalUser,
    totalPackagePurchase,
    totalCompleteTask,
  };
};

// last seven days data
const lastSevenDaysMetaData = async (lastSevenDays: any, today: any) => {
  const totalUser = await prisma.appUser.count({
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });

  const totalDepositUser = await prisma.deposit.groupBy({
    by: ["phoneNumber"],
    _count: true,
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });

  const formattedTotalDepositUser = totalDepositUser.length;

  // total deposit amount
  const totalDepositBalance = await prisma.deposit.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
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
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });
  const totalWithdrawAmount = totalWithdrawBalance._sum.amount;

  // get deposit data group by depositStatus
  const totalSDeposit = await prisma.deposit.groupBy({
    by: ["depositStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });

  const formattedDepositStatus = await totalSDeposit.map((count) => ({
    status: count.depositStatus,
    count: count._count,
  }));

  // get withdraw data group by withdrawStatus
  const totalSWithdraw = await prisma.withdraw.groupBy({
    by: ["withdrawStatus"],
    _count: true,
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });

  const formattedWithdrawStatus = await totalSWithdraw.map((count) => ({
    status: count.withdrawStatus,
    count: count._count,
  }));

  const totalPackagePurchase = await prisma.buyPackage.count({
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });
  const totalCompleteTask = await prisma.completeTask.count({
    where: {
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
    },
  });

  const latestTenSuccessDeposit = await prisma.deposit.findMany({
    where: {
      depositStatus: DepositStatus.SUCCESS,
      createdAt: {
        gte: lastSevenDays, // From the start of lastSevenDays
        lt: today,
      },
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
    totalUser,
    totalPackagePurchase,
    totalCompleteTask,
  };
};

// total data
const totalMetaData = async () => {
  const totalUserAndAdmin = await prisma.user.count();
  const totalAdmin = await prisma.admin.count();
  const totalUser = await prisma.appUser.count();
  const totalDepositUser = await prisma.deposit.groupBy({
    by: ["phoneNumber"],
    _count: true,
  });

  const formattedTotalDepositUser = totalDepositUser.length;
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
