import { UserStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (user: IAuthUser, payload: any) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const referData = await prisma.targetRefer.findFirst({
    where: {
      targetReferQuantity: payload.targetReferQuantity,
      bonusAmount: payload.bonusAmount,
    },
  });

  if (referData) {
    throw new Error("Already added this");
  }

  const result = await prisma.targetRefer.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.targetRefer.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!result) {
    throw new Error("No data found");
  }
  return result;
};

const claimTargetReferBonus = async (user: IAuthUser, payload: any) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
      isDeleted: false,
    },
  });

  const checkItClamied = await prisma.targetReferBonusClaimed.findFirst({
    where: {
      userPhoneNumber: userData?.phoneNumber,
      referCount: payload.totalRefer,
    },
  });
  if (checkItClamied) {
    throw new Error("already claimed");
  }

  const referCount = await prisma.appUser.findMany({
    where: {
      refererBy: userData?.referrelCode,
    },
  });

  if (referCount?.length < payload?.totalRefer) {
    throw new Error("Bad request");
  }

  const targetReferData = await prisma.targetRefer.findMany();

  const filterTargetRefer = await targetReferData?.filter(
    (refer) => refer?.targetReferQuantity === payload?.totalRefer
  );

  const result = await prisma.$transaction(async (tx) => {
    const createClaimedBonus = await prisma.targetReferBonusClaimed.create({
      data: {
        userPhoneNumber: userData?.phoneNumber,
        referCount: payload.totalRefer,
      },
    });
    await prisma.appUser.update({
      where: {
        phoneNumber: userData?.phoneNumber,
        isDeleted: false,
      },
      data: {
        balance: userData?.balance + Number(filterTargetRefer?.[0].bonusAmount),
        referIncome:
          userData?.referIncome + Number(filterTargetRefer?.[0].bonusAmount),
      },
    });

    return createClaimedBonus;
  });
  return result;
};

const getMyReferClaimedData = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
      isDeleted: false,
    },
  });

  const result = await prisma.targetReferBonusClaimed.findMany();
  if (!result) {
    throw new Error("no data found");
  }
  return result;
};

const deleteTargetReferBonusData = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const targetReferBonusData = await prisma.targetRefer.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!targetReferBonusData) {
    throw new Error("Not found data");
  }
  const result = await prisma.targetRefer.delete({
    where: {
      id,
    },
  });
  return result;
};
export const targetReferBonusService = {
  insertInToDB,
  getAllFromDB,
  claimTargetReferBonus,
  getMyReferClaimedData,
  deleteTargetReferBonusData,
};
