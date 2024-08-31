import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (
  user: IAuthUser,
  payload: { bonusAmount: string }
) => {
  // check admin
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const bonusData = await prisma.signUpBonus.findFirst();
  if (bonusData) {
    throw new Error("Sign up bonus already added");
  }
  const result = await prisma.signUpBonus.create({
    data: {
      bonusAmount: parseFloat(payload.bonusAmount),
    },
  });

  return result;
};

const getBonusData = async () => {
  const result = await prisma.signUpBonus.findFirstOrThrow();
  return result;
};
export const signUpBonusService = {
  insertInToDB,
  getBonusData,
};
