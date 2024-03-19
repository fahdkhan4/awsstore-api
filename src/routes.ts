import { Router } from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import categoryRoutes from "./categories/routes";
import bookRoutes from "./books/routes";
import artRoutes from "./art/routes";
import document from "./documents/routes";
import purchaseBookRoutes from "./payment/routes";
import { firebaseStorageMiddleware } from "./middleware/firebase.middleware";
import { authenticate } from "./middleware/authenticateMiddleware";

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

//Art
router.use("/art", artRoutes);

//Documents
router.use("/documents", firebaseStorageMiddleware, document);

//BookPurchase
router.use("/purchase", purchaseBookRoutes);

export default router;
