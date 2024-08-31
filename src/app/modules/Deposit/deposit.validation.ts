import { DepositStatus } from "@prisma/client";
import { z } from "zod";

const createDeposit = z.object({
  paymentNumber: z.string({ required_error: "payment number must provide" }),
  paymentMethod: z.string({ required_error: "payment method must provide" }),
  amount: z.number({ required_error: "amount must provide" }),
  trxId: z.string({ required_error: "trxId must provide" }),
});

const depositBonus = z.object({
  depositBonus: z.number({ required_error: "amount must provide" }),
});

const updateDeposit = z.object({
  depositStatus: z.enum([DepositStatus.REJECTED, DepositStatus.SUCCESS]),
});

export const depositValidation = {
  createDeposit,
  depositBonus,
  updateDeposit,
};
