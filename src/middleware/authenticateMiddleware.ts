import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../auth/utils/jwt";

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
