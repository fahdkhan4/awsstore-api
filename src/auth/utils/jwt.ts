import jwt from "jsonwebtoken";
import { AuthDocument } from "../model/auth.model";
import config from "config";

const secretKey = config.get<string>("secretKey");
const accessTokenTtl = config.get<string>("accessTokenTtl");

export const generateAccessToken = (user: AuthDocument): string => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretKey, { expiresIn: accessTokenTtl });
};

export const verifyAccessToken = (token: string): AuthDocument | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as AuthDocument;
    return decoded;
  } catch (error) {
    return null;
  }
};
