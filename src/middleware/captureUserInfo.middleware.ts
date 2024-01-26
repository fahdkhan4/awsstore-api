import { Request, Response, NextFunction } from "express";
import DeviceDetector from "device-detector-js";
import geoip from "geoip-lite";
import { UserInfo } from "../auth/model/auth.model";

export function captureUserInfoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userAgent = req.headers["user-agent"] || "";
  const deviceDetector = new DeviceDetector();
  const deviceInfo = deviceDetector.parse(userAgent);
  const ip = req.ip as string;
  const location = geoip.lookup(ip);

  const lastLoginLocation = location
    ? `${location.city}, ${location.country}`
    : "Unknown Location";

  (req as any).userInfo = {
    userAgent,
    deviceType: deviceInfo.device?.type || "Unknown Device",
    lastLoginLocation,
  } as UserInfo;

  next();
}
