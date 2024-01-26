import { Router } from "express";
import {
  register,
  login,
  updateUser,
  deleteUser,
  refreshToken,
} from "../auth/controllers/auth.controller";
import { handleAsyncErrors } from "../helpers/route.helper";
import { authenticate } from "../middleware/authenticateMiddleware";
import {
  loginValidatorMiddleware,
  registerValidatorMiddleware,
} from "./auth.validator";
import { captureUserInfoMiddleware } from "../middleware/captureUserInfo.middleware";

const router = Router();

router.post(
  "/register",
  registerValidatorMiddleware,
  handleAsyncErrors(register)
);

router.post(
  "/login",
  [loginValidatorMiddleware, captureUserInfoMiddleware],
  handleAsyncErrors(login)
);

//Needs Fixing
router.put("/:username", authenticate, handleAsyncErrors(updateUser));

router.delete("/:id", authenticate, handleAsyncErrors(deleteUser));

router.post("/refresh-token", handleAsyncErrors(refreshToken));

export default router;
