import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (
  user: IAuthUser,
  payload: { commission: number }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const commissionData = await prisma.referCommission.findFirst();

  if (commissionData) {
    throw new Error("Refer commission already added!");
  }

  const result = await prisma.referCommission.create({
    data: {
      commissionBonus: payload.commission,
    },
  });
  return result;
};

const getBonusData = async (user: IAuthUser) => {
  const result = await prisma.referCommission.findFirstOrThrow();
  if (!result) {
    throw new Error("No bonus data found");
  }
  return result;
};

const deleteBonusData = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const bonusData = await prisma.referCommission.findFirst({
    where: {
      id,
    },
  });

  if (!bonusData) {
    throw new Error("No data found");
  }

  const result = await prisma.referCommission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const referCommissionService = {
  insertInToDB,
  getBonusData,
  deleteBonusData,
};
