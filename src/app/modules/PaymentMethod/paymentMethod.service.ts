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

const getAllPaymentMethod = async () => {
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

export const paymentMethodService = {
  createMethod,
  getAllPaymentMethod,
  deletePaymentMethod,
};
