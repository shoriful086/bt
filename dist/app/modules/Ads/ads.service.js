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
exports.adsService = void 0;
const client_1 = require("@prisma/client");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const insertIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const adsData = yield prisma_1.prisma.ads.findFirst();
    if (adsData) {
        throw new Error("Already added ads price");
    }
    const result = yield prisma_1.prisma.ads.create({
        data: {
            price: payload.price,
        },
    });
    return result;
});
const getAllAdsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.APP_USER) {
        yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    }
    const result = yield prisma_1.prisma.ads.findFirst();
    if (!result) {
        throw new Error("Ads not found ");
    }
    return result;
});
const deleteAds = (user, adsId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    yield prisma_1.prisma.ads.findUniqueOrThrow({
        where: {
            id: adsId,
        },
    });
    const result = yield prisma_1.prisma.ads.delete({
        where: {
            id: adsId,
        },
    });
    return result;
});
exports.adsService = {
    insertIntoDB,
    getAllAdsFromDB,
    deleteAds,
};
