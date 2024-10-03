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
exports.referCommissionService = void 0;
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const commissionData = yield prisma_1.prisma.referCommission.findFirst();
    if (commissionData) {
        throw new Error("Refer commission already added!");
    }
    const result = yield prisma_1.prisma.referCommission.create({
        data: {
            commissionBonus: payload.commission,
        },
    });
    return result;
});
const getBonusData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.referCommission.findFirstOrThrow();
    if (!result) {
        throw new Error("No bonus data found");
    }
    return result;
});
const deleteBonusData = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const bonusData = yield prisma_1.prisma.referCommission.findFirst({
        where: {
            id,
        },
    });
    if (!bonusData) {
        throw new Error("No data found");
    }
    const result = yield prisma_1.prisma.referCommission.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.referCommissionService = {
    insertInToDB,
    getBonusData,
    deleteBonusData,
};
