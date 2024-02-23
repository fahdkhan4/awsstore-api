import express from "express";
import { initiateBookPurchase } from "./controller/purchaseBookController";

const router = express.Router();

router.post("/purchaseBook", initiateBookPurchase);

export default router;
