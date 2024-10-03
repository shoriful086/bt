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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appUserService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../shared/prisma");
const appUser_constants_1 = require("./appUser.constants");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const getUserById = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            email: userData.email,
        },
        include: {
            refer: true,
            deposit: true,
            withdraw: true,
            buyPackage: {
                include: {
                    package: true,
                },
            },
            completeTask: {
                include: {
                    package: true,
                    user: true,
                },
            },
            luckySpins: true,
        },
    });
    return result;
});
const getAllUserFromDB = (user, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, skip, page, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: appUser_constants_1.userSearchableField.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    andConditions.push({ isDeleted: false });
    const whereCondition = { AND: andConditions };
    const result = yield prisma_1.prisma.appUser.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.appUser.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getBlockedFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.appUser.findMany({
        where: {
            isDeleted: true,
        },
    });
    if (!result) {
        throw new Error("No blocked user found");
    }
    return result;
});
const blockedUser = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUser = yield tx.appUser.update({
            where: {
                email: userData.email,
            },
            data: {
                isDeleted: true,
            },
        });
        yield tx.user.update({
            where: {
                email: updateUser.email,
            },
            data: {
                status: client_1.UserStatus.BLOCKED,
            },
        });
        return updateUser;
    }));
    return result;
});
const userUnblocked = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            id,
            isDeleted: true,
        },
    });
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUser = yield tx.appUser.update({
            where: {
                email: userData.email,
            },
            data: {
                isDeleted: false,
            },
        });
        yield tx.user.update({
            where: {
                email: updateUser.email,
            },
            data: {
                status: client_1.UserStatus.ACTIVE,
            },
        });
        return updateUser;
    }));
    return result;
});
const updateUser = (user, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (payload.name || (payload.email && payload.phoneNumber)) {
            yield tx.user.update({
                where: {
                    email: userData.email,
                },
                data: {
                    name: payload.name,
                    email: payload.email,
                    phoneNumber: payload.phoneNumber,
                },
            });
        }
        const updateUserData = yield tx.appUser.update({
            where: {
                email: userData.email,
            },
            data: {
                name: payload.name,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                balance: payload.balance,
                depositBalance: payload.depositBalance,
            },
        });
        return updateUserData;
    }));
    return result;
});
const getMyReferList = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUnique({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    if (!userData) {
        throw new Error("No user found");
    }
    const result = yield prisma_1.prisma.appUser.findMany({
        where: {
            refererBy: userData.referrelCode,
        },
        select: {
            phoneNumber: true,
            name: true,
            deposit: {
                take: 1,
                select: {
                    depositStatus: true,
                },
            },
            createdAt: true,
        },
    });
    return result;
});
const getMyDashboardData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Get yesterday's date at 00:00:00 and 23:59:59
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const todayIncome = yield tx.userDashboardMetaData.aggregate({
            where: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const yesterdayIncome = yield tx.userDashboardMetaData.aggregate({
            where: {
                phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
                createdAt: {
                    gte: yesterday, // Greater than or equal to yesterday 00:00:00
                    lt: today,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const todayEarn = todayIncome._sum.amount;
        const yesterdayEarn = yesterdayIncome._sum.amount;
        return {
            todayEarn,
            yesterdayEarn,
        };
    }));
    return result;
});
exports.appUserService = {
    getUserById,
    blockedUser,
    getAllUserFromDB,
    getBlockedFromDB,
    updateUser,
    userUnblocked,
    getMyReferList,
    getMyDashboardData,
};
