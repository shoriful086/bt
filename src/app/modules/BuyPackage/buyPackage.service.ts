import { any } from "zod";
import { todayDate } from "../../../helpers/isTodayDate";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { CompleteTask } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";

const buyPackage = async (user: IAuthUser, payload: { packageId: string }) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  const packageData = await prisma.package.findUniqueOrThrow({
    where: {
      id: payload.packageId,
    },
  });

  // Check if the user has enough balance
  if (userData.balance < packageData.price) {
    throw new Error("Insufficient balance, Please add Balance");
  }

  const checkBeforeBuyIt = await prisma.buyPackage.findFirst({
    where: {
      userNumber: userData.phoneNumber,
      pakcageId: packageData.id,
    },
  });

  if (checkBeforeBuyIt) {
    throw new Error("Package already buy, please choose another package");
  }

  // If the balance is sufficient, proceed with the transaction
  const result = await prisma.$transaction(async (tx) => {
    await tx.appUser.update({
      where: {
        phoneNumber: userData.phoneNumber,
        isDeleted: false,
      },
      data: {
        balance: userData.balance - packageData.price,
      },
    });

    // Record the package purchase
    const createPackage = await tx.buyPackage.create({
      data: {
        userNumber: userData.phoneNumber,
        pakcageId: packageData.id,
      },
    });

    return createPackage;
  });

  return result;
};

const getMyPurchasePackage = async (user: IAuthUser) => {
  // Check user is valid
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  // Get all my purchase package data
  const getPurchasePackageData = await prisma.buyPackage.findMany({
    where: {
      userNumber: userData.phoneNumber,
    },
    include: {
      package: true,
    },
  });

  // Extracting package IDs from purchaseData
  const purchaseData = await getPurchasePackageData.map((item) => item.package);

  // Fetch today's completed tasks for the user
  const getTodayCompleteTaskData = await prisma.completeTask.findMany({
    where: {
      userNumber: userData.phoneNumber,
    },
  });

  // Filter completed tasks for today
  const todayCompleteTasks = getTodayCompleteTaskData.filter((task) =>
    todayDate.isToday(task.createdAt)
  );

  // Group today's tasks by packageId
  const tasksByPackage = todayCompleteTasks.reduce((acc: any, task) => {
    if (!acc[task.packageId]) {
      acc[task.packageId] = [];
    }
    acc[task.packageId].push(task);
    return acc;
  }, {});

  let remainingTasks = 0;
  let completedPackages: any = [];
  let remainingPackages: any = [];

  // Iterate over each purchased package to check task completion status
  purchaseData.forEach((packageItem) => {
    const packageId = packageItem.id;
    const dailyAds = packageItem.dailyAds;

    // Get the number of tasks completed for this package today
    const tasksCompletedToday = tasksByPackage[packageId] || [];
    const tasksCompletedCount = tasksCompletedToday.length;

    if (tasksCompletedCount >= dailyAds) {
      // If the package's daily ad requirement is met
      completedPackages.push({
        packageId: packageId,
        packageName: packageItem.name,
        tasksCompleted: tasksCompletedCount,
        dailyAds: dailyAds,
        remainingAds: 0,
      });
    } else {
      // If the package's daily ad requirement is not met
      const remainingAds = dailyAds - tasksCompletedCount;
      remainingTasks += remainingAds; // Accumulate remaining tasks
      remainingPackages.push({
        packageId: packageId,
        packageName: packageItem.name,
        dailyAds: dailyAds,
        tasksCompleted: tasksCompletedCount,
        remainingAds: remainingAds,
      });
    }
  });

  return remainingPackages;
};

const getAllPackage = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const groupedResult = await prisma.buyPackage.groupBy({
    by: ["pakcageId"],
    _count: true,
  });

  // Step 2: Fetch package names based on grouped packageIds
  const packageIds = groupedResult.map((group) => group.pakcageId);

  const packages = await prisma.package.findMany({
    where: { id: { in: packageIds } },
    select: { id: true, name: true, createdAt: true },
  });

  // Step 3: Combine the results
  const resultWithPackageNames = groupedResult.map((group) => {
    const packagess = packages.find((pkg) => pkg.id === group.pakcageId);

    return {
      ...group,
      packageName: packagess?.name ? packagess?.name : null,
      createdAt: packagess?.createdAt ? packagess?.createdAt : null,
    };
  });

  return resultWithPackageNames;
};
export const buyPackageService = {
  buyPackage,
  getMyPurchasePackage,
  getAllPackage,
};
