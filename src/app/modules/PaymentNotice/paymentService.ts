import { UserRole, UserStatus } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertInToDB = async (
  user: IAuthUser,
  payload: {
    depositFirstPageNotice: string;
    depositSecondPageNotice: string;
    withdrawPageNotice: string;
  }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const noticeData = await prisma.paymentNotices.findFirst();
  if (noticeData) {
    throw new Error("Already added");
  }
  const result = await prisma.paymentNotices.create({
    data: payload,
  });
  return result;
};

const getAllPaymentNotice = async (user: IAuthUser) => {
  if (user?.role !== UserRole.APP_USER) {
    await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  }
  const userData = await prisma.user.findUnique({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("No user found");
  }
  const noticeData = await prisma.paymentNotices.findMany();
  if (!noticeData) {
    throw new Error("No notice found");
  }
  return noticeData;
};

const deleteNotice = async (user: IAuthUser, noticeId: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const noticeData = await prisma.paymentNotices.findUnique({
    where: {
      id: noticeId,
    },
  });

  if (!noticeData) {
    throw new Error("No notice data your request");
  }

  const result = await prisma.paymentNotices.delete({
    where: {
      id: noticeId,
    },
  });

  return result;
};
export const paymentNotice = {
  insertInToDB,
  getAllPaymentNotice,
  deleteNotice,
};
