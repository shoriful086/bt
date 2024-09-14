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

  const result = await prisma.$transaction(async (tx) => {
    await tx.appUser.update({
      where: {
        phoneNumber: userData?.phoneNumber,
      },
      data: {
        balance: userData?.balance + Number(payload.winAmount),
        earnForSpin: userData?.earnForSpin + Number(payload.winAmount),
      },
    });

    const res = await tx.luckySpins.create({
      data: {
        userNumber: userData?.phoneNumber,
        spinAmount: payload.spinAmount,
        spinLabel: payload.spinLabel,
        winAmount: payload.winAmount,
      },
    });

    await tx.userDashboardMetaData.create({
      data: {
        phoneNumber: userData?.phoneNumber,
        amount: parseFloat(payload.winAmount),
      },
    });

    return res;
  });
  return result;
};

const getAllSpin = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.luckySpins.findMany();
  if (!result) {
    throw new Error("No spin data found");
  }

  return result;
};
export const spinService = {
  insertInToDB,
  getAllSpin,
};
