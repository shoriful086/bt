import { UserStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertIntoDB = async (user: IAuthUser, payload: { multiply: string }) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.wheelMultiply.create({
    data: payload,
  });
  return result;
};

const getAllMultiplyData = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.wheelMultiply.findMany();
  if (!result) {
    throw new Error("no data found");
  }
  return result;
};
export const multiplyService = {
  insertIntoDB,
  getAllMultiplyData,
};
