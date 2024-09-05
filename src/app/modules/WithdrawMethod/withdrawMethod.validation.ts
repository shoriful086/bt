import { z } from "zod";

const createMethod = z.object({
  name: z.string({ required_error: "method name is required" }),
  icon: z.string({ required_error: "icon is required" }).optional(),
  minPayment: z.string({ required_error: "minPayment is required" }),
  maxPayment: z.string({ required_error: "maxPayment is required" }),
});

export const withdrawMethodValidation = {
  createMethod,
};
