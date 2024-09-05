import { Secret } from "jsonwebtoken";
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
      status: UserStatus.ACTIVE,
    },
  });

  const userData2 = await prisma.appUser.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
      isDeleted: false,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.FORBIDDEN, "You're account has been blocked");
  }
  if (!userData2) {
    throw new Error("Account not found");
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
      config.jwt_secret as Secret,
      config.jwt_expires_in as string
    );

    return {
      token,
    };
  }
};

const loginAdmin = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      role: UserRole.SUPER_ADMIN || UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("Admin not found");
  }

  const comparePassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!comparePassword) {
    throw new Error("Incorrect password");
  }

  const token = jwtHelpers.generateToken(
    { phoneNumber: userData.phoneNumber, role: userData.role },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string
  );

  return {
    token,
  };
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
