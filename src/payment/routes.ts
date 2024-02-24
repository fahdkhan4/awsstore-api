import express from "express";
import { initiateBookPurchase } from "./controller/purchaseBookController";
import { ghanaMobileMoneyHook } from "./webhook/paymentWebHooks";

const router = express.Router();

router.post("/purchaseBook", initiateBookPurchase);
router.post("/webhook", ghanaMobileMoneyHook);

export default router;
