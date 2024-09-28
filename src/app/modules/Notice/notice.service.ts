import { UserStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (user: IAuthUser, payload: { notice: string }) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const noticeData = await prisma.notice.findFirst();
  if (noticeData) {
    throw new Error("Already added");
  }
  const result = await prisma.notice.create({
    data: payload,
  });

  return result;
};

const getNotice = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.notice.findFirst();
  if (!result) {
    throw new Error("No notice found");
  }

  return result;
};

const deleteNotice = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const noticeData = await prisma.notice.findFirst();
  if (!noticeData) {
    throw new Error("No notice data found");
  }

  const result = await prisma.notice.delete({
    where: {
      id,
    },
  });

  return result;
};
export const noticeService = {
  insertInToDB,
  getNotice,
  deleteNotice,
};
