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
exports.metaDataService = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const getMetaData = (user, date) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    if ((date === null || date === void 0 ? void 0 : date.date) === "todays") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setHours(today.getHours() + 6);
        return todayMetaData(today.toISOString());
    }
    if ((date === null || date === void 0 ? void 0 : date.date) === "yesterday") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setHours(today.getHours() + 6);
        // yesterday date get
        const todays = new Date();
        todays.setHours(0, 0, 0, 0);
        todays.setHours(todays.getHours() + 6);
        const yesterday = new Date(todays);
        yesterday.setDate(todays.getDate() - 1);
        return yesterdayMetaData(yesterday.toISOString(), today.toISOString());
    }
    if ((date === null || date === void 0 ? void 0 : date.date) === "lastSevenDays") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setHours(today.getHours() + 6);
        // yesterday date get
        const lastSevenDay = new Date();
        lastSevenDay.setHours(0, 0, 0, 0);
        lastSevenDay.setHours(lastSevenDay.getHours() + 6);
        const lastSevenDays = new Date(lastSevenDay);
        lastSevenDays.setDate(lastSevenDay.getDate() - 7);
        return lastSevenDaysMetaData(lastSevenDays.toISOString(), today.toISOString());
    }
    return totalMetaData();
});
// today data
const todayMetaData = (today) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield prisma_1.prisma.appUser.count({
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const totalDepositUser = yield prisma_1.prisma.deposit.groupBy({
        by: ["phoneNumber"],
        _count: true,
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const formattedTotalDepositUser = totalDepositUser.length;
    // total deposit amount
    const totalDepositBalance = yield prisma_1.prisma.deposit.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: today,
            },
        },
    });
    const totalDepositAmount = totalDepositBalance._sum.amount;
    // total withdraw amount
    const totalWithdrawBalance = yield prisma_1.prisma.withdraw.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
            createdAt: {
                gte: today,
            },
        },
    });
    const totalWithdrawAmount = totalWithdrawBalance._sum.amount;
    // get deposit data group by depositStatus
    const totalSDeposit = yield prisma_1.prisma.deposit.groupBy({
        by: ["depositStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const formattedDepositStatus = yield totalSDeposit.map((count) => ({
        status: count.depositStatus,
        count: count._count,
    }));
    // get withdraw data group by withdrawStatus
    const totalSWithdraw = yield prisma_1.prisma.withdraw.groupBy({
        by: ["withdrawStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const formattedWithdrawStatus = yield totalSWithdraw.map((count) => ({
        status: count.withdrawStatus,
        count: count._count,
    }));
    const totalPackagePurchase = yield prisma_1.prisma.buyPackage.count({
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const totalCompleteTask = yield prisma_1.prisma.completeTask.count({
        where: {
            createdAt: {
                gte: today,
            },
        },
    });
    const latestTenSuccessDeposit = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: today,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return {
        data: latestTenSuccessDeposit,
        formattedDepositStatus,
        formattedWithdrawStatus,
        formattedTotalDepositUser,
        totalDepositAmount,
        totalWithdrawAmount,
        totalUser,
        totalPackagePurchase,
        totalCompleteTask,
    };
});
// yesterdayMetaData
const yesterdayMetaData = (yesterday, today) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield prisma_1.prisma.appUser.count({
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const totalDepositUser = yield prisma_1.prisma.deposit.groupBy({
        by: ["phoneNumber"],
        _count: true,
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const formattedTotalDepositUser = totalDepositUser.length;
    // total deposit amount
    const totalDepositBalance = yield prisma_1.prisma.deposit.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const totalDepositAmount = totalDepositBalance._sum.amount;
    // total withdraw amount
    const totalWithdrawBalance = yield prisma_1.prisma.withdraw.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const totalWithdrawAmount = totalWithdrawBalance._sum.amount;
    // get deposit data group by depositStatus
    const totalSDeposit = yield prisma_1.prisma.deposit.groupBy({
        by: ["depositStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const formattedDepositStatus = yield totalSDeposit.map((count) => ({
        status: count.depositStatus,
        count: count._count,
    }));
    // get withdraw data group by withdrawStatus
    const totalSWithdraw = yield prisma_1.prisma.withdraw.groupBy({
        by: ["withdrawStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const formattedWithdrawStatus = yield totalSWithdraw.map((count) => ({
        status: count.withdrawStatus,
        count: count._count,
    }));
    const totalPackagePurchase = yield prisma_1.prisma.buyPackage.count({
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const totalCompleteTask = yield prisma_1.prisma.completeTask.count({
        where: {
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
    });
    const latestTenSuccessDeposit = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: yesterday, // From the start of yesterday
                lt: today,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return {
        data: latestTenSuccessDeposit,
        formattedDepositStatus,
        formattedWithdrawStatus,
        formattedTotalDepositUser,
        totalDepositAmount,
        totalWithdrawAmount,
        totalUser,
        totalPackagePurchase,
        totalCompleteTask,
    };
});
// last seven days data
const lastSevenDaysMetaData = (lastSevenDays, today) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield prisma_1.prisma.appUser.count({
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const totalDepositUser = yield prisma_1.prisma.deposit.groupBy({
        by: ["phoneNumber"],
        _count: true,
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const formattedTotalDepositUser = totalDepositUser.length;
    // total deposit amount
    const totalDepositBalance = yield prisma_1.prisma.deposit.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const totalDepositAmount = totalDepositBalance._sum.amount;
    // total withdraw amount
    const totalWithdrawBalance = yield prisma_1.prisma.withdraw.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const totalWithdrawAmount = totalWithdrawBalance._sum.amount;
    // get deposit data group by depositStatus
    const totalSDeposit = yield prisma_1.prisma.deposit.groupBy({
        by: ["depositStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const formattedDepositStatus = yield totalSDeposit.map((count) => ({
        status: count.depositStatus,
        count: count._count,
    }));
    // get withdraw data group by withdrawStatus
    const totalSWithdraw = yield prisma_1.prisma.withdraw.groupBy({
        by: ["withdrawStatus"],
        _count: true,
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const formattedWithdrawStatus = yield totalSWithdraw.map((count) => ({
        status: count.withdrawStatus,
        count: count._count,
    }));
    const totalPackagePurchase = yield prisma_1.prisma.buyPackage.count({
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const totalCompleteTask = yield prisma_1.prisma.completeTask.count({
        where: {
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
    });
    const latestTenSuccessDeposit = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
            createdAt: {
                gte: lastSevenDays, // From the start of lastSevenDays
                lt: today,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return {
        data: latestTenSuccessDeposit,
        formattedDepositStatus,
        formattedWithdrawStatus,
        formattedTotalDepositUser,
        totalDepositAmount,
        totalWithdrawAmount,
        totalUser,
        totalPackagePurchase,
        totalCompleteTask,
    };
});
// total data
const totalMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUserAndAdmin = yield prisma_1.prisma.user.count();
    const totalAdmin = yield prisma_1.prisma.admin.count();
    const totalUser = yield prisma_1.prisma.appUser.count();
    const totalDepositUser = yield prisma_1.prisma.deposit.groupBy({
        by: ["phoneNumber"],
        _count: true,
    });
    const formattedTotalDepositUser = totalDepositUser.length;
    // total deposit amount
    const totalDepositBalance = yield prisma_1.prisma.deposit.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
        },
    });
    const totalDepositAmount = totalDepositBalance._sum.amount;
    // total withdraw amount
    const totalWithdrawBalance = yield prisma_1.prisma.withdraw.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            withdrawStatus: client_1.WithdrawStatus.PAID,
        },
    });
    const totalWithdrawAmount = totalWithdrawBalance._sum.amount;
    // get deposit data group by depositStatus
    const totalSDeposit = yield prisma_1.prisma.deposit.groupBy({
        by: ["depositStatus"],
        _count: true,
    });
    const formattedDepositStatus = yield totalSDeposit.map((count) => ({
        status: count.depositStatus,
        count: count._count,
    }));
    // get withdraw data group by withdrawStatus
    const totalSWithdraw = yield prisma_1.prisma.withdraw.groupBy({
        by: ["withdrawStatus"],
        _count: true,
    });
    const formattedWithdrawStatus = yield totalSWithdraw.map((count) => ({
        status: count.withdrawStatus,
        count: count._count,
    }));
    const totalPackagePurchase = yield prisma_1.prisma.buyPackage.count();
    const totalCompleteTask = yield prisma_1.prisma.completeTask.count();
    const latestTenSuccessDeposit = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return {
        data: latestTenSuccessDeposit,
        formattedDepositStatus,
        formattedWithdrawStatus,
        formattedTotalDepositUser,
        totalDepositAmount,
        totalWithdrawAmount,
        totalUserAndAdmin,
        totalAdmin,
        totalUser,
        totalPackagePurchase,
        totalCompleteTask,
    };
});
exports.metaDataService = {
    getMetaData,
};
