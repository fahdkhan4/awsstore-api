import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
} from "./controllers/user.controller";
import { handleAsyncErrors } from "../helpers/route.helper";
import { authenticate } from "../middleware/authenticateMiddleware";
import { isAdmin } from "../middleware/roleCheckerMiddleware";

const router = Router();

router.get("/:id", authenticate, handleAsyncErrors(getUserById));

router.put("/:id", authenticate, handleAsyncErrors(updateUser));

router.delete("/:id", [isAdmin, authenticate], handleAsyncErrors(deleteUser));

//Admin Functionality Only Get ALl Users
router.get("", [isAdmin, authenticate], handleAsyncErrors(getAllUsers));

export default router;
