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

export const referCommissionService = {
  insertInToDB,
};
