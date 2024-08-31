import { z } from "zod";

const createPackage = z.object({
  name: z.string({ required_error: "Package name is required" }),
  price: z.number({ required_error: "Package price must be add!" }),
  dailyAds: z.number({ required_error: "Daily ads required" }),
  validity: z.string({ required_error: "Package validity must be add!" }),
});

export const packageValidation = {
  createPackage,
};
