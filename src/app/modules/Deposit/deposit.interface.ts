import { DepositStatus } from "@prisma/client";

export type ICreatedDeposit = {
  phoneNumber: string;
  paymentNumber: string;
  paymentMethod: string;
  amount: string;
  trxId: string;
};

export type IFilterParams = {
  searchTerm?: string;
  phoneNumber?: string;
  paymentMethod?: string;
  depositStatus?: DepositStatus;
  amount?: string;
};
