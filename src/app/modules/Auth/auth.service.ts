import jwt, { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { IAuthUser } from "../../interfaces/auth";
import { UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../erros/apiError";
import httpStatus from "http-status";

const loginUser = async (payload: {
  phoneNumber: string;
  password: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      phoneNumber: payload?.phoneNumber,
      role: UserRole.APP_USER,
      // status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("Input mobile number, and try again");
  }

  if (userData) {
    if (userData?.status === UserStatus.BLOCKED) {
      throw new ApiError(httpStatus.FORBIDDEN, "Your account has been blocked");
    } else if (userData?.status === UserStatus.DELETED) {
      throw new Error("Your account has Deleted");
    }
  }

  const userData2 = await prisma.appUser.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
      isDeleted: false,
    },
  });

  if (!userData2) {
    throw new Error("Account not found");
  }

  if (userData2.isDeleted === true) {
    throw new Error("Your account deleted");
  }

  const comparePassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!comparePassword) {
    throw new Error("Incorrect password");
  }

  if (userData && userData2) {
    const token = jwtHelpers.generateToken(
      { phoneNumber: userData?.phoneNumber, role: userData?.role },
      "cfbkyUS57Bge",
      config.jwt_expires_in as string
    );

    return {
      token,
    };
  }
};

const loginAdmin = async (payload: { email: string; password: string }) => {
  // Find the user based on email
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // Throw an error if the user is not found
  if (!userData) {
    throw new Error("Account not found");
  }

  // Check if the user's role is neither SUPER_ADMIN nor ADMIN
  if (
    userData.role !== UserRole.SUPER_ADMIN &&
    userData.role !== UserRole.ADMIN &&
    userData?.role !== UserRole.DEVELOPER
  ) {
    throw new Error("You do not have access to this data");
  }

  // Check for blocked or deleted account status
  if (userData?.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }
  if (userData?.status === UserStatus.DELETED) {
    throw new Error("Your account has been deleted");
  }

  // Check if the admin account is deleted (redundant, as you check `status` above)
  await prisma.admin.findUniqueOrThrow({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });

  // Verify the password
  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  // Generate JWT token
  // const token = jwtHelpers.generateToken(
  //   { phoneNumber: userData.phoneNumber, role: userData.role },
  //   "cfbkyUS57Bge",
  //   config.jwt_expires_in as string
  // );

  const token = jwt.sign(
    { phoneNumber: userData.phoneNumber, role: userData.role },
    "cfbkyUS57Bge",
    {
      expiresIn: "1d",
      algorithm: "HS256",
    }
  );

  return { token };
};

const changePassword = async (
  user: IAuthUser,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      phoneNumber: user.phoneNumber,
      status: UserStatus.ACTIVE,
    },
  });

  const comparePassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!comparePassword) {
    throw new Error("Incorrect password");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  const result = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return result;
};
export const authService = {
  loginAdmin,
  loginUser,
  changePassword,
};
