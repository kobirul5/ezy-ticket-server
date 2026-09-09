import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const DEFAULT_SECRET: Secret = process.env.JWT_SECRET || "ezy_ticket_super_secret_jwt_key_2026";

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"] | string
) => {
  const token = jwt.sign(payload, secret || DEFAULT_SECRET, {
    algorithm: "HS256",
    expiresIn: (expiresIn || "7d") as SignOptions["expiresIn"],
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret || DEFAULT_SECRET) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
