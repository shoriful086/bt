import { currentAdminIsValid } from "../../../shared/currentAdmin";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/auth";

const getAllAdmin = async (user: IAuthUser) => {
  await currentAdminIsValid(user as IAuthUser, prisma.user.findUnique);

  const result = await prisma.admin.findMany();
  if (!result) {
    throw new Error("No admin data found");
  }
  return result;
};

export const adminService = {
  getAllAdmin,
};
