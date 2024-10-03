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
exports.referBonusService = void 0;
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const bonusData = yield prisma_1.prisma.referBonus.findFirst();
    if (bonusData) {
        throw new Error("Already added");
    }
    const result = yield prisma_1.prisma.referBonus.create({
        data: payload,
    });
    return result;
});
const getDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
        },
    });
    const result = yield prisma_1.prisma.referBonus.findFirst();
    if (!result) {
        throw new Error("no data found");
    }
    return result;
});
const getReferBonusData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUnique({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    if (!userData) {
        throw new Error("Account not found");
    }
    const getReferData = yield prisma_1.prisma.appUser.findMany({
        where: {
            refererBy: userData === null || userData === void 0 ? void 0 : userData.referrelCode,
            isDeleted: false,
        },
        include: {
            deposit: {
                select: {
                    depositStatus: true,
                },
            },
        },
    });
    const getOnlySuccessDepositData = getReferData === null || getReferData === void 0 ? void 0 : getReferData.map((sr) => {
        var _a;
        // Filter the deposit array inside each 'sr'
        const successDeposits = (_a = sr === null || sr === void 0 ? void 0 : sr.deposit) === null || _a === void 0 ? void 0 : _a.filter((dp) => (dp === null || dp === void 0 ? void 0 : dp.depositStatus) === "SUCCESS");
        return Object.assign(Object.assign({}, sr), { deposit: successDeposits });
    }).filter((sr) => { var _a; return ((_a = sr === null || sr === void 0 ? void 0 : sr.deposit) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    // reward data get
    const getRewardData = yield prisma_1.prisma.referBonus.findFirstOrThrow();
    // compare refer length and reward required invite friend length
    if (userData &&
        (getOnlySuccessDepositData === null || getOnlySuccessDepositData === void 0 ? void 0 : getOnlySuccessDepositData.length) ==
            Number(getRewardData === null || getRewardData === void 0 ? void 0 : getRewardData.inviteFriendLength)) {
        yield prisma_1.prisma.appUser.update({
            where: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
            },
            data: {
                balance: (userData === null || userData === void 0 ? void 0 : userData.balance) + (getRewardData === null || getRewardData === void 0 ? void 0 : getRewardData.bonusAmount),
                referIncome: (userData === null || userData === void 0 ? void 0 : userData.referIncome) + (getRewardData === null || getRewardData === void 0 ? void 0 : getRewardData.bonusAmount),
            },
        });
        yield prisma_1.prisma.referBonusClaimed.create({
            data: {
                userNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                amount: getRewardData === null || getRewardData === void 0 ? void 0 : getRewardData.bonusAmount,
                referCount: getRewardData === null || getRewardData === void 0 ? void 0 : getRewardData.inviteFriendLength,
            },
        });
    }
    else {
        throw new Error("Bad request");
    }
});
const getMyRewardData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.referBonusClaimed.findFirstOrThrow({
        where: {
            userNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
        },
    });
    return result;
});
exports.referBonusService = {
    insertInToDB,
    getReferBonusData,
    getMyRewardData,
    getDataFromDB,
};
