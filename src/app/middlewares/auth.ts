import jwt from "jsonwebtoken";
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
      console.log(token);
      if (!token) {
        throw new Error("You're not authorized");
      }

      const verifyUser = jwt.verify(token, "cfbkyUS57Bge") as any;
      req.user = verifyUser;

      if (roles?.length && !roles.includes(verifyUser?.role)) {
        throw new Error("Forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
