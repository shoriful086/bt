import { fileUploader } from "../../../helpers/fileUploader";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";
import { IFileType } from "../../interfaces/fileUpload";

const insertInToDB = async (user: IAuthUser, file: IFileType, payload: any) => {
  await currentAdminIsValid(user, prisma.user.findUnique);

  const methodData = await prisma.withdrawMethod.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (methodData) {
    throw new Error(`${methodData.name} already added`);
  }

  if (file) {
    const uploadIcon = await fileUploader.uploadCloudinary(file);
    payload.icon = uploadIcon?.secure_url;
  }

  const result = await prisma.withdrawMethod.create({
    data: payload,
  });
  return result;
};

const getAllWithdrawMethod = async () => {
  const paymentMethodData = await prisma.withdrawMethod.findMany();
  if (!paymentMethodData) {
    throw new Error("No withdraw method available");
  }
  return paymentMethodData;
};

export const withdrawMethodService = {
  insertInToDB,
  getAllWithdrawMethod,
};
