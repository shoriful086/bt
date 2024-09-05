import { z } from "zod";

const createAd = z.object({
  price: z.number({ required_error: "Must be input price" }),
});

export const adsValidation = {
  createAd,
};
