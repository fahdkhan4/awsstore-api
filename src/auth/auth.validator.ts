import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

export const handleValidationErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof MongooseError.ValidationError) {
    const validationErrors = Object.values(error.errors).map(
      (err: any) => err.message
    );
    res.status(400).json({ errors: validationErrors });
  } else if (error.code === 11000) {
    const key = Object.keys(error.keyValue)[0];
    res.status(400).json({ error: `${key} is already taken` });
  } else {
    next(error);
  }
};
