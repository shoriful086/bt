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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../shared/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_constants_1 = require("./user.constants");
const currentAdmin_1 = require("../../../shared/currentAdmin");
const checkReferCodeIsValis_1 = __importDefault(require("../../../helpers/checkReferCodeIsValis"));
const config_1 = __importDefault(require("../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const referralCode = Math.floor(100000 + Math.random() * 900000).toString();
    // check user is already exist
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            phoneNumber: (_a = payload === null || payload === void 0 ? void 0 : payload.appUser) === null || _a === void 0 ? void 0 : _a.phoneNumber,
        },
    });
    if (isUserExists) {
        throw new Error("User already exist");
    }
    if (((_b = payload === null || payload === void 0 ? void 0 : payload.appUser) === null || _b === void 0 ? void 0 : _b.name.length) > 20) {
        throw new Error("Name must be under 20 characters");
    }
    // create appUser and refer
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                name: payload.appUser.name,
                phoneNumber: payload.appUser.phoneNumber,
                email: payload.appUser.email,
                password: hashedPassword,
                role: client_1.UserRole.APP_USER,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        const signUpBonusData = yield tx.signUpBonus.findFirst();
        const newUser = yield tx.appUser.create({
            data: {
                name: payload.appUser.name,
                phoneNumber: user.phoneNumber,
                email: payload.appUser.email,
                balance: (signUpBonusData === null || signUpBonusData === void 0 ? void 0 : signUpBonusData.bonusAmount) ? signUpBonusData.bonusAmount : 0,
                depositBalance: 0,
                referIncome: 0,
                earnedForAd: 0,
                earnForSpin: 0,
                referrelCode: referralCode,
                refererBy: payload.appUser.refererBy,
                referLink: `https://btpay.com/register?referral=${referralCode}`,
            },
        });
        yield (0, checkReferCodeIsValis_1.default)(payload);
        // const token = await jwtHelpers.generateToken(
        //   { phoneNumber: newUser.phoneNumber, role: user.role },
        //   config.jwt_secret as Secret,
        //   config.jwt_expires_in as string
        // );
        const token = jsonwebtoken_1.default.sign({ phoneNumber: newUser.phoneNumber, role: user.role }, "cfbkyUS57Bge", {
            expiresIn: "1d",
            algorithm: "HS256",
        });
        console.log(config_1.default.jwt_secret);
        return {
            token,
        };
    }));
    return result;
});
const createAdmin = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            email: (_a = payload === null || payload === void 0 ? void 0 : payload.admin) === null || _a === void 0 ? void 0 : _a.email,
        },
    });
    if (isUserExists) {
        throw new Error("User already exist");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                name: payload.admin.name,
                phoneNumber: payload.admin.phoneNumber,
                email: payload.admin.email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        const newAdmin = yield tx.admin.create({
            data: {
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
            },
        });
        return newAdmin;
    }));
    return result;
});
const updateProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("User not found");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let updateUser;
        if (user.role === client_1.UserRole.APP_USER) {
            yield tx.user.update({
                where: {
                    phoneNumber: userData.phoneNumber,
                },
                data: {
                    name: payload.name,
                },
            });
            updateUser = yield prisma_1.prisma.appUser.update({
                where: {
                    phoneNumber: userData.phoneNumber,
                },
                data: {
                    name: payload.name,
                },
            });
        }
        else {
            yield tx.user.update({
                where: {
                    phoneNumber: userData.phoneNumber,
                },
                data: {
                    name: payload.name,
                },
            });
            updateUser = yield prisma_1.prisma.admin.update({
                where: {
                    phoneNumber: userData.phoneNumber,
                },
                data: {
                    name: payload.name,
                },
            });
        }
        return updateUser;
    }));
    return result;
});
const updateUserStatus = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.prisma.user.update({
        where: {
            id: userData.id,
        },
        data: {
            status: payload.status,
        },
    });
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            phoneNumber: user.phoneNumber,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    let profileInfo;
    if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.APP_USER) {
        profileInfo = yield prisma_1.prisma.appUser.findUnique({
            where: {
                email: userData.email,
                isDeleted: false,
            },
            include: {
                refer: true,
                deposit: true,
                withdraw: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                buyPackage: {
                    include: {
                        package: true,
                    },
                },
            },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.prisma.user.findUniqueOrThrow({
            where: {
                email: userData.email,
                status: client_1.UserStatus.ACTIVE,
            },
            select: {
                email: true,
                name: true,
                phoneNumber: true,
                createdAt: true,
                status: true,
                role: true,
            },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.prisma.user.findUniqueOrThrow({
            where: {
                email: userData.email,
                status: client_1.UserStatus.ACTIVE,
            },
            select: {
                email: true,
                name: true,
                phoneNumber: true,
                createdAt: true,
                status: true,
                role: true,
            },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.DEVELOPER) {
        profileInfo = yield prisma_1.prisma.user.findUniqueOrThrow({
            where: {
                email: userData.email,
                status: client_1.UserStatus.ACTIVE,
            },
            select: {
                email: true,
                name: true,
                phoneNumber: true,
                createdAt: true,
                status: true,
                role: true,
            },
        });
    }
    return profileInfo;
});
const getAllUserFromDB = (user, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    // check admin running query time active
    yield (0, currentAdmin_1.currentAdminIsValid)(user, prisma_1.prisma.user.findUnique);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, skip, page, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constants_1.userSearchableField.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereCondition = { AND: andConditions };
    const result = yield prisma_1.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.user.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.userService = {
    createUser,
    createAdmin,
    updateProfile,
    updateUserStatus,
    getMyProfile,
    getAllUserFromDB,
};
