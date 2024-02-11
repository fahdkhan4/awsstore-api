// types.ts
import { NextFunction, RequestHandler, Response } from "express";

export interface CustomRequest extends Request {
  firebaseStorage: any;
}

export type CustomMiddleware = (
  req: CustomRequest,
  res: Response<any, Record<string, any>>, // Adjust Response type
  next: NextFunction
) => void;
