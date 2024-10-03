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
exports.withdrawMethodService = void 0;
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertInToDB = (user, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const methodData = yield prisma_1.prisma.withdrawMethod.findFirst({
        where: {
            name: {
                equals: payload.name,
                mode: "insensitive",
            },
        },
    });
    if (methodData) {
        throw new Error(`${methodData.name} already added`);
    }
    if (file) {
        const uploadIcon = yield fileUploader_1.fileUploader.uploadCloudinary(file);
        payload.icon = uploadIcon === null || uploadIcon === void 0 ? void 0 : uploadIcon.secure_url;
    }
    const result = yield prisma_1.prisma.withdrawMethod.create({
        data: payload,
    });
    return result;
});
const getAllWithdrawMethod = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.APP_USER) {
        yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    }
    const paymentMethodData = yield prisma_1.prisma.withdrawMethod.findMany();
    if (!paymentMethodData) {
        throw new Error("No withdraw method available");
    }
    return paymentMethodData;
});
const deleteWithdrawMethod = (user, withdrawId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const withdrawMethodData = yield prisma_1.prisma.withdrawMethod.findUnique({
        where: {
            id: withdrawId,
        },
    });
    if (!withdrawMethodData) {
        throw new Error("Payment method data not found");
    }
    const result = yield prisma_1.prisma.withdrawMethod.delete({
        where: {
            id: withdrawId,
        },
    });
    return result;
});
exports.withdrawMethodService = {
    insertInToDB,
    getAllWithdrawMethod,
    deleteWithdrawMethod,
};
