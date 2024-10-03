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
exports.currentAdminIsValid = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../app/erros/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const currentAdminIsValid = (user, table) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = yield table({
        where: {
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            // status: UserStatus.ACTIVE,
            // role: UserRole.SUPER_ADMIN || UserRole.ADMIN,
        },
    });
    if ((adminData === null || adminData === void 0 ? void 0 : adminData.role) !== client_1.UserRole.SUPER_ADMIN &&
        (adminData === null || adminData === void 0 ? void 0 : adminData.role) !== client_1.UserRole.ADMIN &&
        (adminData === null || adminData === void 0 ? void 0 : adminData.role) !== client_1.UserRole.DEVELOPER) {
        throw new Error("You do not have access data");
    }
    if ((adminData === null || adminData === void 0 ? void 0 : adminData.status) === client_1.UserStatus.BLOCKED) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, "Your account has been blocked");
    }
    if ((adminData === null || adminData === void 0 ? void 0 : adminData.status) === client_1.UserStatus.DELETED) {
        throw new Error("Your account has been deleted");
    }
    if (!adminData) {
        throw new Error("Your are not authorized");
    }
});
exports.currentAdminIsValid = currentAdminIsValid;
