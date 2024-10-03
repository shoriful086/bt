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
exports.paymentMethodService = void 0;
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const createMethod = (user, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const methodData = yield prisma_1.prisma.paymentMethod.findFirst({
        where: {
            name: {
                equals: payload.name,
                mode: "insensitive",
            },
        },
    });
    if (methodData) {
        throw new Error(`${payload === null || payload === void 0 ? void 0 : payload.name} already exist`);
    }
    if (file) {
        const methodIcon = yield fileUploader_1.fileUploader.uploadCloudinary(file);
        payload.icon = methodIcon === null || methodIcon === void 0 ? void 0 : methodIcon.secure_url;
    }
    const result = yield prisma_1.prisma.paymentMethod.create({
        data: payload,
    });
    return result;
});
const getAllPaymentMethod = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.APP_USER) {
        yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    }
    const paymentMethodData = yield prisma_1.prisma.paymentMethod.findMany();
    if (!paymentMethodData) {
        throw new Error("No payment method available");
    }
    return paymentMethodData;
});
const deletePaymentMethod = (user, paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const paymentMethodData = yield prisma_1.prisma.paymentMethod.findUnique({
        where: {
            id: paymentMethodId,
        },
    });
    if (!paymentMethodData) {
        throw new Error("Payment method data not found");
    }
    const result = yield prisma_1.prisma.paymentMethod.delete({
        where: {
            id: paymentMethodId,
        },
    });
    return result;
});
const createPrivateNumber = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const numberData = yield prisma_1.prisma.privateNumber.findFirst();
    if (numberData) {
        throw new Error("Already added");
    }
    const result = yield prisma_1.prisma.privateNumber.create({
        data: {
            number: payload.number,
            copyDurationCount: Number(payload.copyDurationCount),
            count: 0,
        },
    });
    return result;
});
const getPrivateNumber = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
        },
    });
    const result = yield prisma_1.prisma.privateNumber.findFirst();
    return result;
});
const updatePrivateNumberCount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const numberData = yield prisma_1.prisma.privateNumber.findFirstOrThrow({
        where: {
            id: payload.data,
        },
    });
    if (!numberData) {
        throw new Error("something went wrong");
    }
    const result = yield prisma_1.prisma.privateNumber.update({
        where: {
            id: numberData === null || numberData === void 0 ? void 0 : numberData.id,
        },
        data: {
            count: numberData && numberData.count + 1,
        },
    });
    return result;
});
const deletePrivateNumber = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const numberData = yield prisma_1.prisma.privateNumber.findFirst({
        where: {
            id,
        },
    });
    if (!numberData) {
        throw new Error("No data found");
    }
    const result = yield prisma_1.prisma.privateNumber.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.paymentMethodService = {
    createMethod,
    getAllPaymentMethod,
    deletePaymentMethod,
    createPrivateNumber,
    getPrivateNumber,
    updatePrivateNumberCount,
    deletePrivateNumber,
};
