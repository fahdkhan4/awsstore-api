import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import { HttpException } from "../helpers/HttpException";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (isCelebrateError(error)) {
    return next(error);
  }

  console.error(error);

  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).send(message);
};
