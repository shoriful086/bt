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
exports.authService = void 0;
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = require("../../../shared/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../erros/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUnique({
        where: {
            phoneNumber: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
            role: client_1.UserRole.APP_USER,
            // status: UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("Input mobile number, and try again");
    }
    if (userData) {
        if ((userData === null || userData === void 0 ? void 0 : userData.status) === client_1.UserStatus.BLOCKED) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, "Your account has been blocked");
        }
        else if ((userData === null || userData === void 0 ? void 0 : userData.status) === client_1.UserStatus.DELETED) {
            throw new Error("Your account has Deleted");
        }
    }
    const userData2 = yield prisma_1.prisma.appUser.findUnique({
        where: {
            phoneNumber: payload.phoneNumber,
            isDeleted: false,
        },
    });
    if (!userData2) {
        throw new Error("Account not found");
    }
    if (userData2.isDeleted === true) {
        throw new Error("Your account deleted");
    }
    const comparePassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!comparePassword) {
        throw new Error("Incorrect password");
    }
    if (userData && userData2) {
        const token = jwtHelpers_1.jwtHelpers.generateToken({ phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber, role: userData === null || userData === void 0 ? void 0 : userData.role }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
        return {
            token,
        };
    }
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user based on email
    const userData = yield prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    // Throw an error if the user is not found
    if (!userData) {
        throw new Error("Account not found");
    }
    // Check if the user's role is neither SUPER_ADMIN nor ADMIN
    if (userData.role !== client_1.UserRole.SUPER_ADMIN &&
        userData.role !== client_1.UserRole.ADMIN &&
        (userData === null || userData === void 0 ? void 0 : userData.role) !== client_1.UserRole.DEVELOPER) {
        throw new Error("You do not have access to this data");
    }
    // Check for blocked or deleted account status
    if ((userData === null || userData === void 0 ? void 0 : userData.status) === client_1.UserStatus.BLOCKED) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, "Your account has been blocked");
    }
    if ((userData === null || userData === void 0 ? void 0 : userData.status) === client_1.UserStatus.DELETED) {
        throw new Error("Your account has been deleted");
    }
    // Check if the admin account is deleted (redundant, as you check `status` above)
    yield prisma_1.prisma.admin.findUniqueOrThrow({
        where: {
            email: payload.email,
            isDeleted: false,
        },
    });
    // Verify the password
    const isPasswordValid = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isPasswordValid) {
        throw new Error("Incorrect password");
    }
    // Generate JWT token
    const token = jwtHelpers_1.jwtHelpers.generateToken({ phoneNumber: userData.phoneNumber, role: userData.role }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    return { token };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const comparePassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!comparePassword) {
        throw new Error("Incorrect password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    const result = yield prisma_1.prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return result;
});
exports.authService = {
    loginAdmin,
    loginUser,
    changePassword,
};
