import { UserRole } from "@prisma/client";

export type IAuthUser = {
  phoneNumber: string;
  role: UserRole;
};
