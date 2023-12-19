import { Router } from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";

const router = Router();

//Health Checker
router.use("/health", (_, res) => res.status(200).json({ status: "OK" }));

//Authentication
router.use("/auth", authRoutes);

//User
router.use("/users", userRoutes);

export default router;
