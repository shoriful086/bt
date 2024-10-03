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
exports.paymentNotice = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const noticeData = yield prisma_1.prisma.paymentNotices.findFirst();
    if (noticeData) {
        throw new Error("Already added");
    }
    const result = yield prisma_1.prisma.paymentNotices.create({
        data: payload,
    });
    return result;
});
const getAllPaymentNotice = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.APP_USER) {
        yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    }
    const userData = yield prisma_1.prisma.user.findUnique({
        where: {
            phoneNumber: user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("No user found");
    }
    const noticeData = yield prisma_1.prisma.paymentNotices.findMany();
    if (!noticeData) {
        throw new Error("No notice found");
    }
    return noticeData;
});
const deleteNotice = (user, noticeId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const noticeData = yield prisma_1.prisma.paymentNotices.findUnique({
        where: {
            id: noticeId,
        },
    });
    if (!noticeData) {
        throw new Error("No notice data your request");
    }
    const result = yield prisma_1.prisma.paymentNotices.delete({
        where: {
            id: noticeId,
        },
    });
    return result;
});
exports.paymentNotice = {
    insertInToDB,
    getAllPaymentNotice,
    deleteNotice,
};
