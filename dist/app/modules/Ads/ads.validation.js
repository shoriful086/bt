"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adsValidation = void 0;
const zod_1 = require("zod");
const createAd = zod_1.z.object({
    price: zod_1.z.number({ required_error: "Must be input price" }),
});
exports.adsValidation = {
    createAd,
};
