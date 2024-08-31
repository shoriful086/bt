import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign({ payload }, secret, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  });
  return token;
};

const verifyJwtToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyJwtToken,
};
