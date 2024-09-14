import { UserRole } from "@prisma/client";

export type IAppUser = {
  password: string;
  appUser: {
    name: string;
    email: string;
    phoneNumber: string;
    balance: string;
    depositBalance: string;
    referrelCode: string;
    refererBy?: string;
    referLink: string;
  };
};

export type IAdmin = {
  password: string;
  admin: {
    name: string;
    email: string;
    phoneNumber: string;
  };
};

export type IFilterParams = {
  searchTerm?: string;
  email?: string;
  phoneNumber?: string;
};
