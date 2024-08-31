import { UserStatus } from "@prisma/client";
import { z } from "zod";

const createAppUser = z.object({
  password: z
    .string({ required_error: "password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(10, "password could not be long"),
  appUser: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z.string({ required_error: "email is required" }),
    phoneNumber: z
      .string({ required_error: "phoneNumber is required" })
      .min(11, "Please enter 11 digit number")
      .max(11, "Please enter 11 digit number"),
    refererBy: z.string().optional(),
  }),
});

const createAdmin = z.object({
  password: z
    .string({ required_error: "password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(10, "password could not be long"),
  admin: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z.string({ required_error: "email is required" }),
    phoneNumber: z
      .string({ required_error: "phoneNumber is required" })
      .min(11, "Please enter 11 digit number")
      .max(11, "Please enter 11 digit number"),
  }),
});

const updateUser = z.object({
  name: z.string(),
});

const updateUserStatus = z.object({
  status: z.enum(["ACTIVE", "BLOCKED", "DELETED"]),
});

export const userValidation = {
  createAppUser,
  createAdmin,
  updateUser,
  updateUserStatus,
};
