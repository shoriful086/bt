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
exports.buyPackageService = void 0;
const isTodayDate_1 = require("../../../helpers/isTodayDate");
const prisma_1 = require("../../../shared/prisma");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const buyPackage = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    const packageData = yield prisma_1.prisma.package.findUniqueOrThrow({
        where: {
            id: payload.packageId,
        },
    });
    // Check if the user has enough balance
    if (userData.balance < packageData.price) {
        throw new Error("Insufficient balance, Please add Balance");
    }
    const checkBeforeBuyIt = yield prisma_1.prisma.buyPackage.findFirst({
        where: {
            userNumber: userData.phoneNumber,
            pakcageId: packageData.id,
        },
    });
    if (checkBeforeBuyIt) {
        throw new Error("Package already buy, please choose another package");
    }
    // If the balance is sufficient, proceed with the transaction
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.appUser.update({
            where: {
                phoneNumber: userData.phoneNumber,
                isDeleted: false,
            },
            data: {
                balance: userData.balance - packageData.price,
            },
        });
        // Record the package purchase
        const createPackage = yield tx.buyPackage.create({
            data: {
                userNumber: userData.phoneNumber,
                pakcageId: packageData.id,
            },
        });
        return createPackage;
    }));
    return result;
});
const getMyPurchasePackage = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check user is valid
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    // Get all my purchase package data
    const getPurchasePackageData = yield prisma_1.prisma.buyPackage.findMany({
        where: {
            userNumber: userData.phoneNumber,
        },
        include: {
            package: true,
        },
    });
    // Extracting package IDs from purchaseData
    const purchaseData = yield getPurchasePackageData.map((item) => item.package);
    // Fetch today's completed tasks for the user
    const getTodayCompleteTaskData = yield prisma_1.prisma.completeTask.findMany({
        where: {
            userNumber: userData.phoneNumber,
        },
    });
    // Filter completed tasks for today
    const todayCompleteTasks = getTodayCompleteTaskData.filter((task) => isTodayDate_1.todayDate.isToday(task.createdAt));
    // Group today's tasks by packageId
    const tasksByPackage = todayCompleteTasks.reduce((acc, task) => {
        if (!acc[task.packageId]) {
            acc[task.packageId] = [];
        }
        acc[task.packageId].push(task);
        return acc;
    }, {});
    let remainingTasks = 0;
    let completedPackages = [];
    let remainingPackages = [];
    // Iterate over each purchased package to check task completion status
    purchaseData.forEach((packageItem) => {
        const packageId = packageItem.id;
        const dailyAds = packageItem.dailyAds;
        // Get the number of tasks completed for this package today
        const tasksCompletedToday = tasksByPackage[packageId] || [];
        const tasksCompletedCount = tasksCompletedToday.length;
        if (tasksCompletedCount >= dailyAds) {
            // If the package's daily ad requirement is met
            completedPackages.push({
                packageId: packageId,
                packageName: packageItem.name,
                tasksCompleted: tasksCompletedCount,
                dailyAds: dailyAds,
                remainingAds: 0,
            });
        }
        else {
            // If the package's daily ad requirement is not met
            const remainingAds = dailyAds - tasksCompletedCount;
            remainingTasks += remainingAds; // Accumulate remaining tasks
            remainingPackages.push({
                packageId: packageId,
                packageName: packageItem.name,
                dailyAds: dailyAds,
                tasksCompleted: tasksCompletedCount,
                remainingAds: remainingAds,
            });
        }
    });
    return remainingPackages;
});
const getAllPackage = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const groupedResult = yield prisma_1.prisma.buyPackage.groupBy({
        by: ["pakcageId"],
        _count: true,
    });
    // Step 2: Fetch package names based on grouped packageIds
    const packageIds = groupedResult.map((group) => group.pakcageId);
    const packages = yield prisma_1.prisma.package.findMany({
        where: { id: { in: packageIds } },
        select: { id: true, name: true, createdAt: true },
    });
    // Step 3: Combine the results
    const resultWithPackageNames = groupedResult.map((group) => {
        const packagess = packages.find((pkg) => pkg.id === group.pakcageId);
        return Object.assign(Object.assign({}, group), { packageName: (packagess === null || packagess === void 0 ? void 0 : packagess.name) ? packagess === null || packagess === void 0 ? void 0 : packagess.name : null, createdAt: (packagess === null || packagess === void 0 ? void 0 : packagess.createdAt) ? packagess === null || packagess === void 0 ? void 0 : packagess.createdAt : null });
    });
    return resultWithPackageNames;
});
exports.buyPackageService = {
    buyPackage,
    getMyPurchasePackage,
    getAllPackage,
};
