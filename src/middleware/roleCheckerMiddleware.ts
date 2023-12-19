import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../auth/utils/jwt";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return res.status(401).json({ error: "Access token not provided" });

  try {
    const user = verifyAccessToken(accessToken) as { role: string };

    if (user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Access forbidden. Admin role required." });
    }
  } catch (error) {
    res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};
