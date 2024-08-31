import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { NextFunction, Request, Response } from "express";
import { IAuthUser } from "../interfaces/auth";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("You're not authorized");
      }

      const verifyUser = jwtHelpers.verifyJwtToken(
        token,
        config.jwt_secret as Secret
      );

      req.user = verifyUser.payload;

      if (roles.length && !roles.includes(verifyUser.payload.role)) {
        throw new Error("Forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
