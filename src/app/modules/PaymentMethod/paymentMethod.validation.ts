import { z } from "zod";

const createMethod = z.object({
  name: z.string({ required_error: "method name is required" }),
  number: z.string({ required_error: "number must be input" }),
  icon: z.string({ required_error: "icon is required" }),
  minPayment: z.string({ required_error: "minPayment is required" }),
  maxPayment: z.string({ required_error: "maxPayment is required" }),
});

export const paymentMethodValidation = {
  createMethod,
};
