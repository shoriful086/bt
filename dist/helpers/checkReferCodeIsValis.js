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
const client_1 = require("@prisma/client");
const prisma_1 = require("../shared/prisma");
const checkReferCodeAndCreateRefer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = payload === null || payload === void 0 ? void 0 : payload.appUser) === null || _a === void 0 ? void 0 : _a.refererBy) {
        const checkReferCode = yield prisma_1.prisma.appUser.findFirst({
            where: {
                referrelCode: payload.appUser.refererBy,
            },
        });
        if (!checkReferCode) {
            throw new Error("Invalid refer code");
        }
        yield prisma_1.prisma.refer.create({
            data: {
                referUsedUserNumber: checkReferCode.phoneNumber,
                referCode: checkReferCode.referrelCode,
                status: client_1.ReferStatus.PENDING,
            },
        });
    }
});
exports.default = checkReferCodeAndCreateRefer;
