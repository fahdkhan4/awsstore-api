import { Request } from "express";
import { AuthDocument } from "./auth/model/auth.model";

declare module "express" {
  interface Request {
    user?: AuthDocument;
  }
}
