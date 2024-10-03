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
exports.spinService = void 0;
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.appUser.update({
            where: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
            },
            data: {
                balance: (userData === null || userData === void 0 ? void 0 : userData.balance) + Number(payload.winAmount),
                earnForSpin: (userData === null || userData === void 0 ? void 0 : userData.earnForSpin) + Number(payload.winAmount),
            },
        });
        const res = yield tx.luckySpins.create({
            data: {
                userNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                spinAmount: payload.spinAmount,
                spinLabel: payload.spinLabel,
                winAmount: payload.winAmount,
            },
        });
        yield tx.userDashboardMetaData.create({
            data: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                amount: parseFloat(payload.winAmount),
            },
        });
        return res;
    }));
    return result;
});
const getAllSpin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.luckySpins.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!result) {
        throw new Error("No spin data found");
    }
    return result;
});
exports.spinService = {
    insertInToDB,
    getAllSpin,
};
