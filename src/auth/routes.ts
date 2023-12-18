import { Router } from "express";
import {
  register,
  login,
  updateUser,
  deleteUser,
} from "../auth/controllers/auth.controller";
import { handleValidationErrors } from "./auth.validator";
import { handleAsyncErrors } from "../helpers/route.helper";
import { authenticate } from "../middleware/authenticateMiddleware";

const router = Router();

router.post("/register", handleAsyncErrors(register), handleValidationErrors);

router.post("/login", handleAsyncErrors(login), handleValidationErrors);

//Needs Fixing
router.put(
  "/:username",
  authenticate,
  handleAsyncErrors(updateUser),
  handleAsyncErrors
);

router.delete(
  "/:id",
  authenticate,
  handleAsyncErrors(deleteUser),
  handleAsyncErrors
);

export default router;
