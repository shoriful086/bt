"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawService = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check user
    const userData = yield prisma_1.prisma.appUser.findUnique({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    if (!userData) {
        throw new Error("User not found");
    }
    // Strict balance check
    if ((userData === null || userData === void 0 ? void 0 : userData.balance) < (payload === null || payload === void 0 ? void 0 : payload.amount)) {
        throw new Error("Insufficient Balance ");
    }
    // Method validity check
    const methodData = yield prisma_1.prisma.withdrawMethod.findFirstOrThrow({
        where: {
            name: {
                equals: payload.paymentMethod,
                mode: "insensitive",
            },
        },
    });
    // Check if the withdrawal amount is above the minimum required amount
    if (payload.amount < parseFloat(methodData.minPayment)) {
        throw new Error(`Minimum ${methodData.name} withdraw ${methodData.minPayment} BDT`);
    }
    // Check for at least one successful deposit
    const depositData = yield prisma_1.prisma.deposit.findFirst({
        where: {
            phoneNumber: userData.phoneNumber,
            depositStatus: client_1.DepositStatus.SUCCESS,
        },
    });
    if (!depositData) {
        throw new Error("Please make a minimum of one deposit before withdrawing.");
    }
    // Transaction to update balance and create a withdrawal record
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createWithdraw = yield tx.withdraw.create({
            data: {
                phoneNumber: userData.phoneNumber,
                paymentReceivedNumber: payload.paymentReceivedNumber,
                paymentMethod: payload.paymentMethod,
                amount: payload.amount,
            },
        });
        yield tx.appUser.update({
            where: {
                phoneNumber: userData.phoneNumber,
                isDeleted: false,
            },
            data: {
                balance: (userData === null || userData === void 0 ? void 0 : userData.balance) - (createWithdraw === null || createWithdraw === void 0 ? void 0 : createWithdraw.amount),
            },
        });
        // const nowTime = await new Date(Date.now());
        // const formattedTime = await dateFormat(nowTime);
        // const message = await `
        // 🔔*Withdraw Request Successfully Processed*
        //  Method: ${methodData.name}
        //  User: ${userData.phoneNumber}
        //  Payment Number: ${payload.paymentReceivedNumber}
        //  Amount: ${payload.amount}
        //  Time: ${formattedTime}
        // `;
        // await sendMessageTelegramBot(message);
        return createWithdraw;
    }));
    return result;
});
const getPendingWithdraw = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUniqueOrThrow);
    const result = yield prisma_1.prisma.withdraw.findMany({
        where: {
            withdrawStatus: client_1.WithdrawStatus.PENDING,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (result.length === 0) {
        throw new Error("No withdraw data pending");
    }
    return result;
});
const getPaidWithdraw = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUniqueOrThrow);
    const result = yield prisma_1.prisma.withdraw.findMany({
        where: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    if (result.length === 0) {
        throw new Error("No withdraw data paid");
    }
    return result;
});
const updateWithdrawStatus = (user, withdrawId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUniqueOrThrow);
    const withdrawData = yield prisma_1.prisma.withdraw.findUnique({
        where: {
            id: withdrawId,
            withdrawStatus: client_1.WithdrawStatus.PENDING,
        },
    });
    if (!withdrawData) {
        throw new Error("No withdraw pending");
    }
    const result = yield prisma_1.prisma.withdraw.update({
        where: {
            id: withdrawData.id,
        },
        data: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
        },
    });
    return result;
});
exports.withdrawService = {
    insertInToDB,
    getPendingWithdraw,
    getPaidWithdraw,
    updateWithdrawStatus,
};
