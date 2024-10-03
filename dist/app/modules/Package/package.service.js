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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const apiError_1 = __importDefault(require("../../erros/apiError"));
const client_1 = require("@prisma/client");
const createPackage = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const packageData = yield prisma_1.prisma.package.findFirst({
        where: {
            name: {
                equals: payload.name,
                mode: "insensitive",
            },
        },
    });
    if (packageData) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `${packageData.name} package already exist`);
    }
    const result = yield prisma_1.prisma.package.create({
        data: payload,
    });
    return result;
});
const getAllPackage = (user) => __awaiter(void 0, void 0, void 0, function* () {
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
        throw new Error("User not found");
    }
    if (user.role === client_1.UserRole.APP_USER) {
        const userData = yield prisma_1.prisma.appUser.findUnique({
            where: {
                phoneNumber: user.phoneNumber,
                isDeleted: false,
            },
        });
        if (!userData) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Your account not found");
        }
    }
    const result = yield prisma_1.prisma.package.findMany({
        orderBy: {
            price: "asc",
        },
    });
    return result;
});
const deletePackage = (user, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const packageData = yield prisma_1.prisma.package.findUnique({
        where: {
            id: packageId,
        },
    });
    if (!packageData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
    }
    const result = yield prisma_1.prisma.package.delete({
        where: {
            id: packageId,
        },
    });
    return result;
});
const updatePackage = (user, packageId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const packageData = yield prisma_1.prisma.package.findUniqueOrThrow({
        where: {
            id: packageId,
        },
    });
    const result = yield prisma_1.prisma.package.update({
        where: {
            id: packageData === null || packageData === void 0 ? void 0 : packageData.id,
        },
        data: payload,
    });
    return result;
});
exports.packageService = {
    createPackage,
    getAllPackage,
    deletePackage,
    updatePackage,
};
