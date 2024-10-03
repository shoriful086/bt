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
exports.bannerService = void 0;
const currentAdmin_1 = require("../../../shared/currentAdmin");
const prisma_1 = require("../../../shared/prisma");
const fileUploader_1 = require("../../../helpers/fileUploader");
const client_1 = require("@prisma/client");
const insertInToDB = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    let bannerImage;
    if (req.file) {
        const bannerIcon = yield fileUploader_1.fileUploader.uploadCloudinary(req.file);
        bannerImage = bannerIcon === null || bannerIcon === void 0 ? void 0 : bannerIcon.secure_url;
    }
    const result = yield prisma_1.prisma.banner.create({
        data: {
            bannerImage: bannerImage,
        },
    });
    return result;
});
const getAllBannerImage = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.APP_USER) {
        yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    }
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const bannerData = yield prisma_1.prisma.banner.findMany();
    if (!bannerData) {
        throw new Error("No data found");
    }
    return bannerData;
});
const deleteBanner = (user, bannerId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const bannerData = yield prisma_1.prisma.banner.findUnique({
        where: {
            id: bannerId,
        },
    });
    if (!bannerData) {
        throw new Error("Bad request");
    }
    const result = yield prisma_1.prisma.banner.delete({
        where: {
            id: bannerData.id,
        },
    });
    return result;
});
exports.bannerService = {
    insertInToDB,
    getAllBannerImage,
    deleteBanner,
};
