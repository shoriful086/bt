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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositService = void 0;
const client_1 = require("@prisma/client");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_1 = require("../../../shared/prisma");
const deposit_constant_1 = require("./deposit.constant");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const sendMessageTelegramBot_1 = require("../../../helpers/sendMessageTelegramBot");
const apiError_1 = __importDefault(require("../../erros/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const formateDate_1 = __importDefault(require("./formateDate"));
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check trxId
    const checkIsDataExists = yield prisma_1.prisma.deposit.findFirst({
        where: {
            trxId: payload.trxId,
        },
    });
    if (checkIsDataExists) {
        throw new apiError_1.default(http_status_1.default.ALREADY_REPORTED, "Invalid trxId");
    }
    // check user is valid
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            isDeleted: false,
        },
    });
    // check method is valid
    const methodData = yield prisma_1.prisma.paymentMethod.findFirstOrThrow({
        where: {
            name: {
                equals: payload.paymentMethod,
                mode: "insensitive",
            },
        },
    });
    const amount = parseFloat(payload.amount);
    const minPayment = parseFloat(methodData.minPayment);
    // Check if amount is less than minPayment
    if (amount < minPayment) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Minimum ${methodData.name} payment is ${minPayment} BDT`);
    }
    // check trx id length
    const name = payload.paymentMethod.toLowerCase();
    let maxLength;
    if (name === "nagad") {
        maxLength = 8;
    }
    else if (name === "bkash") {
        maxLength = 10;
    }
    else {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid service provider");
    }
    if (((_a = payload === null || payload === void 0 ? void 0 : payload.trxId) === null || _a === void 0 ? void 0 : _a.length) !== maxLength) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Transaction id must be ${maxLength} character`);
    }
    // finally create deposit data
    const result = yield prisma_1.prisma.deposit.create({
        data: {
            phoneNumber: userData.phoneNumber,
            paymentNumber: payload.paymentNumber,
            paymentMethod: methodData.name,
            amount: parseFloat(payload.amount),
            trxId: payload.trxId,
        },
    });
    const nowTime = new Date(Date.now());
    const formattedTime = yield (0, formateDate_1.default)(nowTime);
    const message = `Deposit Request Successfully
  Method: ${methodData.name}
  User: ${userData.phoneNumber}
  Payment Number: ${payload.paymentNumber}
  Amount: ${payload.amount} BDT
  Trx ID: ${payload.trxId}
  Time: ${formattedTime}
  `;
    yield (0, sendMessageTelegramBot_1.sendMessageTelegramBot)(message);
    return result;
});
const getAllDepositData = (user, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, skip, page, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: deposit_constant_1.depositSearchableField.map((field) => ({
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
    const whereCondition = { AND: andConditions };
    const result = yield prisma_1.prisma.deposit.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.deposit.count({
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
const getPendingDeposit = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.PENDING,
        },
    });
    if (!result) {
        throw new Error("no pending deposit data");
    }
    return result;
});
const getSuccessDeposit = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.SUCCESS,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    if (!result) {
        throw new Error("no success deposit data");
    }
    return result;
});
const getRejectedDeposit = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.deposit.findMany({
        where: {
            depositStatus: client_1.DepositStatus.REJECTED,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    if (!result) {
        throw new Error("no rejected deposit data");
    }
    return result;
});
const depositBonus = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const bonusData = yield prisma_1.prisma.depositBonus.findFirst();
    if (bonusData) {
        throw new Error("Deposit bonus already added");
    }
    const result = yield prisma_1.prisma.depositBonus.create({
        data: {
            depositBonus: payload.depositBonus,
        },
    });
    return result;
});
const getBonusData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const result = yield prisma_1.prisma.depositBonus.findFirstOrThrow();
    if (!result) {
        throw new Error("No bonus data found");
    }
    return result;
});
const deleteBonusData = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const bonusData = yield prisma_1.prisma.depositBonus.findFirst({
        where: {
            id,
        },
    });
    if (!bonusData) {
        throw new Error("No data found");
    }
    const result = yield prisma_1.prisma.depositBonus.delete({
        where: {
            id,
        },
    });
    return result;
});
const updateDepositStatus = (user, depositId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    // check deposit id in valid
    const depositData = yield prisma_1.prisma.deposit.findUniqueOrThrow({
        where: {
            id: depositId,
            depositStatus: client_1.DepositStatus.PENDING,
        },
    });
    // check deposit user is valid
    const userData = yield prisma_1.prisma.appUser.findUniqueOrThrow({
        where: {
            phoneNumber: depositData.phoneNumber,
            isDeleted: false,
        },
    });
    // calculate refer commission
    const getReferBonusData = yield prisma_1.prisma.referCommission.findFirst();
    const referCommission = (depositData.amount * getReferBonusData.commissionBonus) / 100;
    // final result
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let updateDepositUser;
        // process payment
        if (payload.depositStatus === client_1.DepositStatus.REJECTED) {
            // update deposit status is rejected
            updateDepositUser = yield tx.deposit.update({
                where: {
                    id: depositData.id,
                },
                data: {
                    depositStatus: client_1.DepositStatus.REJECTED,
                },
            });
        }
        else {
            updateDepositUser = yield tx.deposit.update({
                where: {
                    id: depositData.id,
                },
                data: {
                    depositStatus: client_1.DepositStatus.SUCCESS,
                },
            });
            // added deposit bonus
            const deposit = yield prisma_1.prisma.depositBonus.findFirst();
            let bonus = 0;
            if (deposit && depositData.amount >= 1000) {
                bonus = deposit.depositBonus;
            }
            // update current deposit user balance
            yield tx.appUser.update({
                where: {
                    phoneNumber: userData.phoneNumber,
                    isDeleted: false,
                },
                data: {
                    balance: userData.balance + depositData.amount + bonus,
                    depositBalance: userData.depositBalance + depositData.amount,
                },
            });
            // update if current deposit user which used refer code
            if (userData.refererBy) {
                const depositUser = yield prisma_1.prisma.appUser.findFirst({
                    where: {
                        referrelCode: userData.refererBy,
                    },
                });
                yield tx.appUser.update({
                    where: {
                        phoneNumber: depositUser === null || depositUser === void 0 ? void 0 : depositUser.phoneNumber,
                    },
                    data: {
                        balance: depositUser.balance + referCommission,
                        referIncome: depositUser.referIncome + referCommission,
                    },
                });
            }
        }
        return updateDepositUser;
    }));
    return result;
});
exports.depositService = {
    insertInToDB,
    getAllDepositData,
    getPendingDeposit,
    getSuccessDeposit,
    getRejectedDeposit,
    updateDepositStatus,
    depositBonus,
    getBonusData,
    deleteBonusData,
};
