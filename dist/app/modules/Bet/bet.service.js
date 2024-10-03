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
exports.betService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../shared/prisma");
const createBet = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    if ((userData === null || userData === void 0 ? void 0 : userData.balance) < payload.amount) {
        throw new Error("Balance is low");
    }
    const isDeposit = yield prisma_1.prisma.deposit.findFirst({
        where: {
            phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
            depositStatus: client_1.DepositStatus.SUCCESS,
        },
    });
    if (!isDeposit) {
        throw new Error("Please add balance and play spin");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUserBalance = yield tx.appUser.update({
            where: {
                phoneNumber: userData.phoneNumber,
            },
            data: {
                balance: (userData === null || userData === void 0 ? void 0 : userData.balance) - payload.amount,
            },
        });
        const createBet = yield tx.bet.create({
            data: {
                userNumber: updateUserBalance === null || updateUserBalance === void 0 ? void 0 : updateUserBalance.phoneNumber,
                amount: payload.amount,
            },
        });
        return createBet;
    }));
    return result;
});
const getMyLastSpinBet = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.bet.findFirst({
        where: {
            userNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
exports.betService = {
    createBet,
    getMyLastSpinBet,
};
