import { UserRole } from "@prisma/client";
import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const insertIntoDB = async (user: IAuthUser, payload: { price: number }) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const adsData = await prisma.ads.findFirst();
  if (adsData) {
    throw new Error("Already added ads price");
  }

  const result = await prisma.ads.create({
    data: {
      price: payload.price,
    },
  });

  return result;
};

const getAllAdsFromDB = async (user: IAuthUser) => {
  if (user?.role !== UserRole.APP_USER) {
    await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  }
  const result = await prisma.ads.findFirst();
  if (!result) {
    throw new Error("Ads not found ");
  }

  return result;
};

const deleteAds = async (user: IAuthUser, adsId: string) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);
  await prisma.ads.findUniqueOrThrow({
    where: {
      id: adsId,
    },
  });

  const result = await prisma.ads.delete({
    where: {
      id: adsId,
    },
  });

  return result;
};

export const adsService = {
  insertIntoDB,
  getAllAdsFromDB,
  deleteAds,
};
