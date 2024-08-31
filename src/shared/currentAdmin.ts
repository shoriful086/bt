import { UserStatus } from "@prisma/client";
import { IAuthUser } from "../app/interfaces/auth";

export const currentAdminIsValid = async (user: IAuthUser, table: any) => {
  const adminData = await table({
    where: {
      phoneNumber: user?.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  if (!adminData) {
    throw new Error("Your account has been suspended! please contact us");
  }
};
