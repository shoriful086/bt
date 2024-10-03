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
exports.targetReferBonusService = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const referData = yield prisma_1.prisma.targetRefer.findFirst({
        where: {
            targetReferQuantity: payload.targetReferQuantity,
            bonusAmount: payload.bonusAmount,
        },
    });
    if (referData) {
        throw new Error("Already added this");
    }
    const result = yield prisma_1.prisma.targetRefer.create({
        data: payload,
    });
    return result;
});
const getAllFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.prisma.targetRefer.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
    if (!result) {
        throw new Error("No data found");
    }
    return result;
});
const claimTargetReferBonus = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            isDeleted: false,
        },
    });
    const checkItClamied = yield prisma_1.prisma.targetReferBonusClaimed.findFirst({
        where: {
            userPhoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
            referCount: payload.totalRefer,
        },
    });
    if (checkItClamied) {
        throw new Error("already claimed");
    }
    const referCount = yield prisma_1.prisma.appUser.findMany({
        where: {
            refererBy: userData === null || userData === void 0 ? void 0 : userData.referrelCode,
        },
    });
    if ((referCount === null || referCount === void 0 ? void 0 : referCount.length) < (payload === null || payload === void 0 ? void 0 : payload.totalRefer)) {
        throw new Error("Bad request");
    }
    const targetReferData = yield prisma_1.prisma.targetRefer.findMany();
    const filterTargetRefer = yield (targetReferData === null || targetReferData === void 0 ? void 0 : targetReferData.filter((refer) => (refer === null || refer === void 0 ? void 0 : refer.targetReferQuantity) === (payload === null || payload === void 0 ? void 0 : payload.totalRefer)));
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createClaimedBonus = yield prisma_1.prisma.targetReferBonusClaimed.create({
            data: {
                userPhoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                referCount: payload.totalRefer,
            },
        });
        yield prisma_1.prisma.appUser.update({
            where: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                isDeleted: false,
            },
            data: {
                balance: (userData === null || userData === void 0 ? void 0 : userData.balance) + Number(filterTargetRefer === null || filterTargetRefer === void 0 ? void 0 : filterTargetRefer[0].bonusAmount),
                referIncome: (userData === null || userData === void 0 ? void 0 : userData.referIncome) + Number(filterTargetRefer === null || filterTargetRefer === void 0 ? void 0 : filterTargetRefer[0].bonusAmount),
            },
        });
        return createClaimedBonus;
    }));
    return result;
});
const getMyReferClaimedData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.targetReferBonusClaimed.findMany();
    if (!result) {
        throw new Error("no data found");
    }
    return result;
});
const deleteTargetReferBonusData = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const targetReferBonusData = yield prisma_1.prisma.targetRefer.findUniqueOrThrow({
        where: {
            id,
        },
    });
    if (!targetReferBonusData) {
        throw new Error("Not found data");
    }
    const result = yield prisma_1.prisma.targetRefer.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.targetReferBonusService = {
    insertInToDB,
    getAllFromDB,
    claimTargetReferBonus,
    getMyReferClaimedData,
    deleteTargetReferBonusData,
};
