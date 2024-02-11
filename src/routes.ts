import { Router } from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import categoryRoutes from "./categories/routes";
import bookRoutes from "./books/routes";
import document from "./documents/routes";
import { firebaseStorageMiddleware } from "./middleware/firebase.middleware";

const router = Router();

//Health Checker
router.use("/health", (_, res) => res.status(200).json({ status: "OK" }));

//Authentication
router.use("/auth", authRoutes);

//User
router.use("/users", userRoutes);

//Categories
router.use("/categories", categoryRoutes);

//Books
router.use("/books", firebaseStorageMiddleware, bookRoutes);

//Documents
router.use("/documents", firebaseStorageMiddleware, document);

export default router;
