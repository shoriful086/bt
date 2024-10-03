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
exports.noticeService = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const noticeData = yield prisma_1.prisma.notice.findFirst();
    if (noticeData) {
        throw new Error("Already added");
    }
    const result = yield prisma_1.prisma.notice.create({
        data: payload,
    });
    return result;
});
const getNotice = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.prisma.notice.findFirst();
    if (!result) {
        throw new Error("No notice found");
    }
    return result;
});
const deleteNotice = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const noticeData = yield prisma_1.prisma.notice.findFirst();
    if (!noticeData) {
        throw new Error("No notice data found");
    }
    const result = yield prisma_1.prisma.notice.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.noticeService = {
    insertInToDB,
    getNotice,
    deleteNotice,
};
