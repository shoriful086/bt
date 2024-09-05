import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (user: IAuthUser, payload: any) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  const packageData = await prisma.package.findUnique({
    where: {
      id: payload.packageId,
    },
  });

  if (!packageData) {
    throw new Error("Package not found.");
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const checkComplete = await prisma.completeTask.findMany({
    where: {
      userNumber: userData.phoneNumber,
      createdAt: {
        gte: startOfDay, // Greater than or equal to start of the day
        lte: endOfDay, // Less than or equal to end of the day
      },
      packageId: payload.packageId, // Check for the specific package ID
    },
  });

  // Check if the completed tasks for today exceed the daily ads limit
  if (checkComplete.length >= packageData.dailyAds) {
    throw new Error("Don't submit this task today.");
  }

  const result = prisma.$transaction(async (tx) => {
    const completeTask = await tx.completeTask.create({
      data: {
        userNumber: userData.phoneNumber,
        ...payload,
      },
    });

    await tx.appUser.update({
      where: {
        phoneNumber: userData.phoneNumber,
      },
      data: {
        balance: userData.balance + 100,
        earnedForAd: userData.earnedForAd + 100,
      },
    });

    return completeTask;
  });
  return result;
};

const getAllCompleteTask = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const result = await prisma.completeTask.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!result) {
    throw new Error("No complete task history");
  }
  return result;
};

export const completeTaskService = {
  insertInToDB,
  getAllCompleteTask,
};
