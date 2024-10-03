"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createDeposit = zod_1.z.object({
    paymentNumber: zod_1.z.string({ required_error: "payment number must provide" }),
    paymentMethod: zod_1.z.string({ required_error: "payment method must provide" }),
    amount: zod_1.z.number({ required_error: "amount must provide" }),
    trxId: zod_1.z.string({ required_error: "trxId must provide" }),
});
const depositBonus = zod_1.z.object({
    depositBonus: zod_1.z.number({ required_error: "amount must provide" }),
});
const updateDeposit = zod_1.z.object({
    depositStatus: zod_1.z.enum([client_1.DepositStatus.REJECTED, client_1.DepositStatus.SUCCESS]),
});
exports.depositValidation = {
    createDeposit,
    depositBonus,
    updateDeposit,
};
