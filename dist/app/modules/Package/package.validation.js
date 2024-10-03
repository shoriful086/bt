"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageValidation = void 0;
const zod_1 = require("zod");
const createPackage = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Package name is required" }),
    price: zod_1.z.number({ required_error: "Package price must be add!" }),
    dailyAds: zod_1.z.number({ required_error: "Daily ads required" }),
    validity: zod_1.z.string({ required_error: "Package validity must be add!" }),
});
const updatePackage = zod_1.z.object({
    name: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    dailyAds: zod_1.z.number().optional(),
    validity: zod_1.z.string().optional(),
});
exports.packageValidation = {
    createPackage,
    updatePackage,
};
