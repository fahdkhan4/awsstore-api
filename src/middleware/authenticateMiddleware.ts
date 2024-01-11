import { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
} from "../auth/utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return res.status(401).json({ error: "Access token not provided" });

  const user = verifyAccessToken(accessToken);

  if (!user) return res.status(401).json({ error: "Invalid access token" });

  req.user = user;

  next();
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token not provided" });

  const user = verifyRefreshToken(refreshToken);

  if (!user) return res.status(401).json({ error: "Invalid refresh token" });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  // Send the new tokens to the client
  res.json({ accessToken, refreshToken: newRefreshToken });
};
