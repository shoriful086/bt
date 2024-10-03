"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMethodValidation = void 0;
const zod_1 = require("zod");
const createMethod = zod_1.z.object({
    name: zod_1.z.string({ required_error: "method name is required" }),
    number: zod_1.z.string({ required_error: "number must be input" }),
    icon: zod_1.z.string({ required_error: "icon is required" }).optional(),
    minPayment: zod_1.z.string({ required_error: "minPayment is required" }),
    maxPayment: zod_1.z.string({ required_error: "maxPayment is required" }),
});
exports.paymentMethodValidation = {
    createMethod,
};
