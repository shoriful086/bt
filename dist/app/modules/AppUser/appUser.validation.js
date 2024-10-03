"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appUserValidation = void 0;
const zod_1 = require("zod");
const updateUserValidation = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    balance: zod_1.z.number().optional(),
    depositBalance: zod_1.z.number().optional(),
});
exports.appUserValidation = {
    updateUserValidation,
};
