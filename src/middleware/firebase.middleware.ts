import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../../config/firebase.config";
import { Response, NextFunction } from "express";
import { CustomRequest, CustomMiddleware } from "./types";

initializeApp(firebaseConfig);

const storage = getStorage();

export const firebaseStorageMiddleware: CustomMiddleware = (
  req: CustomRequest,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  req.firebaseStorage = storage;
  next();
};
