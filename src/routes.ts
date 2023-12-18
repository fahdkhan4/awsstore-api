import { Router } from "express";
import authRoutes from "./auth/routes";

const router = Router();

router.use("/health", (_, res) => res.status(200).json({ status: "OK" }));

router.use("/auth", authRoutes);

export default router;
