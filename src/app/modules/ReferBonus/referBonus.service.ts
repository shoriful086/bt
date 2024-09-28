import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { userController } from "../User/user.controller";

const insertInToDB = async (user: IAuthUser, payload: any) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const bonusData = await prisma.referBonus.findFirst();
  if (bonusData) {
    throw new Error("Already added");
  }
  const result = await prisma.referBonus.create({
    data: payload,
  });
  return result;
};
const getDataFromDB = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
    },
  });

  const result = await prisma.referBonus.findFirst();
  if (!result) {
    throw new Error("no data found");
  }

  return result;
};

const getReferBonusData = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUnique({
    where: {
      phoneNumber: user.phoneNumber,
      isDeleted: false,
    },
  });

  if (!userData) {
    throw new Error("Account not found");
  }

  const getReferData = await prisma.appUser.findMany({
    where: {
      refererBy: userData?.referrelCode,
      isDeleted: false,
    },
    include: {
      deposit: {
        select: {
          depositStatus: true,
        },
      },
    },
  });

  const getOnlySuccessDepositData = getReferData
    ?.map((sr) => {
      // Filter the deposit array inside each 'sr'
      const successDeposits = sr?.deposit?.filter(
        (dp) => dp?.depositStatus === "SUCCESS"
      );

      return {
        ...sr, // Keep the rest of the data
        deposit: successDeposits, // Replace deposit with only the successful ones
      };
    })
    .filter((sr) => sr?.deposit?.length > 0);

  // reward data get
  const getRewardData = await prisma.referBonus.findFirstOrThrow();

  // compare refer length and reward required invite friend length
  if (
    userData &&
    getOnlySuccessDepositData?.length ==
      Number(getRewardData?.inviteFriendLength)
  ) {
    await prisma.appUser.update({
      where: {
        phoneNumber: userData?.phoneNumber,
      },
      data: {
        balance: userData?.balance + getRewardData?.bonusAmount,
        referIncome: userData?.referIncome + getRewardData?.bonusAmount,
      },
    });

    await prisma.referBonusClaimed.create({
      data: {
        userNumber: userData?.phoneNumber,
        amount: getRewardData?.bonusAmount,
        referCount: getRewardData?.inviteFriendLength,
      },
    });
  } else {
    throw new Error("Bad request");
  }
};

const getMyRewardData = async (user: IAuthUser) => {
  const userData = await prisma.appUser.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
      isDeleted: false,
    },
  });

  const result = await prisma.referBonusClaimed.findFirstOrThrow({
    where: {
      userNumber: userData?.phoneNumber,
    },
  });
  return result;
};
export const referBonusService = {
  insertInToDB,
  getReferBonusData,
  getMyRewardData,
  getDataFromDB,
};
