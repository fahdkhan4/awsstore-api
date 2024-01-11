import jwt from "jsonwebtoken";
import { AuthDocument } from "../model/auth.model";
import config from "config";

const secretKey = config.get<string>("secretKey");
const accessTokenTtl = config.get<string>("accessTokenTtl");
const refreshTokenTtl = config.get<string>("refreshTokenTtl");

export const generateTokens = (
  user: AuthDocument
): { accessToken: string; refreshToken: string } => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    accountType: user.accountType,
  };

  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: accessTokenTtl,
  });
  const refreshToken = jwt.sign(payload, secretKey, {
    expiresIn: refreshTokenTtl,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): AuthDocument | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as AuthDocument;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): AuthDocument | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as AuthDocument;
    return decoded;
  } catch (error) {
    return null;
  }
};
