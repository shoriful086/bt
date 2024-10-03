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
exports.completeTaskService = void 0;
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    const packageData = yield prisma_1.prisma.package.findUnique({
        where: {
            id: payload.packageId,
        },
    });
    if (!packageData) {
        throw new Error("Package not found.");
    }
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const checkComplete = yield prisma_1.prisma.completeTask.findMany({
        where: {
            userNumber: userData.phoneNumber,
            createdAt: {
                gte: startOfDay, // Greater than or equal to start of the day
                lte: endOfDay, // Less than or equal to end of the day
            },
            packageId: payload.packageId, // Check for the specific package ID
        },
    });
    // Check if the completed tasks for today exceed the daily ads limit
    if (checkComplete.length >= packageData.dailyAds) {
        throw new Error("Don't submit this task today.");
    }
    const newBalance = yield prisma_1.prisma.ads.findFirst();
    const result = prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const completeTask = yield tx.completeTask.create({
            data: {
                userNumber: userData.phoneNumber,
                packageId: payload.packageId,
                packageName: payload.packageName,
                earned: payload.earned,
            },
        });
        yield tx.appUser.update({
            where: {
                phoneNumber: userData.phoneNumber,
            },
            data: {
                balance: userData.balance + newBalance.price,
                earnedForAd: userData.earnedForAd + newBalance.price,
            },
        });
        yield tx.userDashboardMetaData.create({
            data: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                amount: newBalance.price,
            },
        });
        return completeTask;
    }));
    return result;
});
const getAllCompleteTask = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.completeTask.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!result) {
        throw new Error("No complete task history");
    }
    return result;
});
exports.completeTaskService = {
    insertInToDB,
    getAllCompleteTask,
};
