import { z } from "zod";

const updateUserValidation = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  balance: z.number().optional(),
  depositBalance: z.number().optional(),
});

export const appUserValidation = {
  updateUserValidation,
};
