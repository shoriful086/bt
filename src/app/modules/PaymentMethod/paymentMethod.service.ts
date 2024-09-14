import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { ICloudinaryResponse, IFileType } from "../../interfaces/fileUpload";

const createMethod = async (user: IAuthUser, file: IFileType, payload: any) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const methodData = await prisma.paymentMethod.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (methodData) {
    throw new Error(`${payload?.name} already exist`);
  }

  if (file) {
    const methodIcon = await fileUploader.uploadCloudinary(file);
    payload.icon = methodIcon?.secure_url;
  }

  const result = await prisma.paymentMethod.create({
    data: payload,
  });
  return result;
};

const getAllPaymentMethod = async (user: IAuthUser) => {
  if (user?.role !== UserRole.APP_USER) {
    await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  }
  const paymentMethodData = await prisma.paymentMethod.findMany();
  if (!paymentMethodData) {
    throw new Error("No payment method available");
  }
  return paymentMethodData;
};

const deletePaymentMethod = async (
  user: IAuthUser,
  paymentMethodId: string
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const paymentMethodData = await prisma.paymentMethod.findUnique({
    where: {
      id: paymentMethodId,
    },
  });

  if (!paymentMethodData) {
    throw new Error("Payment method data not found");
  }

  const result = await prisma.paymentMethod.delete({
    where: {
      id: paymentMethodId,
    },
  });

  return result;
};

const createPrivateNumber = async (
  user: IAuthUser,
  payload: {
    number: string;
    copyDurationCount: number;
    count: number;
  }
) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  const numberData = await prisma.privateNumber.findFirst();
  if (numberData) {
    throw new Error("Already added");
  }
  const result = await prisma.privateNumber.create({
    data: {
      number: payload.number,
      copyDurationCount: Number(payload.copyDurationCount),
      count: 0,
    },
  });

  return result;
};

const getPrivateNumber = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
    },
  });

  const result = await prisma.privateNumber.findFirst();
  return result;
};

const updatePrivateNumberCount = async (payload: any) => {
  const numberData = await prisma.privateNumber.findFirstOrThrow({
    where: {
      id: payload.data,
    },
  });

  if (!numberData) {
    throw new Error("something went wrong");
  }

  const result = await prisma.privateNumber.update({
    where: {
      id: numberData?.id,
    },
    data: {
      count: numberData && numberData.count + 1,
    },
  });

  return result;
};

const deletePrivateNumber = async (user: IAuthUser, id: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const numberData = await prisma.privateNumber.findFirst({
    where: {
      id,
    },
  });

  if (!numberData) {
    throw new Error("No data found");
  }

  const result = await prisma.privateNumber.delete({
    where: {
      id,
    },
  });

  return result;
};
export const paymentMethodService = {
  createMethod,
  getAllPaymentMethod,
  deletePaymentMethod,
  createPrivateNumber,
  getPrivateNumber,
  updatePrivateNumberCount,
  deletePrivateNumber,
};
