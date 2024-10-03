"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createAppUser = zod_1.z.object({
    password: zod_1.z
        .string({ required_error: "password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(10, "Password max 10 character"),
    appUser: zod_1.z.object({
        name: zod_1.z.string({ required_error: "name is required" }),
        email: zod_1.z.string({ required_error: "email is required" }),
        phoneNumber: zod_1.z
            .string({ required_error: "phoneNumber is required" })
            .min(11, "Please enter 11 digit number")
            .max(11, "Please enter 11 digit number"),
        refererBy: zod_1.z.string().optional(),
    }),
});
const createAdmin = zod_1.z.object({
    password: zod_1.z
        .string({ required_error: "password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(10, "password max 10 character"),
    admin: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "name is required" })
            .max(20, "Please under 20 character name"),
        email: zod_1.z.string({ required_error: "email is required" }),
        phoneNumber: zod_1.z
            .string({ required_error: "phoneNumber is required" })
            .min(11, "Please enter 11 digit number")
            .max(11, "Please enter 11 digit number"),
    }),
});
const updateUser = zod_1.z.object({
    name: zod_1.z.string(),
});
const updateUserStatus = zod_1.z.object({
    status: zod_1.z.enum(["ACTIVE", "BLOCKED", "DELETED"]),
});
exports.userValidation = {
    createAppUser,
    createAdmin,
    updateUser,
    updateUserStatus,
};
