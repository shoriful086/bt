import { Request } from "express";
import { IAuthUser } from "../../interfaces/auth";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserStatus } from "@prisma/client";

const insertInToDB = async (user: IAuthUser, req: Request) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  let bannerImage;

  if (req.file) {
    const bannerIcon = await fileUploader.uploadCloudinary(req.file);
    bannerImage = bannerIcon?.secure_url;
  }

  const result = await prisma.banner.create({
    data: {
      bannerImage: bannerImage as string,
    },
  });
  return result;
};

const getAllBannerImage = async (user: IAuthUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user?.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  const bannerData = await prisma.banner.findMany();
  if (!bannerData) {
    throw new Error("No data found");
  }

  return bannerData;
};

const deleteBanner = async (user: IAuthUser, bannerId: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const bannerData = await prisma.banner.findUnique({
    where: {
      id: bannerId,
    },
  });

  if (!bannerData) {
    throw new Error("Bad request");
  }

  const result = await prisma.banner.delete({
    where: {
      id: bannerData.id,
    },
  });

  return result;
};

export const bannerService = {
  insertInToDB,
  getAllBannerImage,
  deleteBanner,
};
