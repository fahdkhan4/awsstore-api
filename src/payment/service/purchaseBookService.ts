import mongoose from "mongoose";
import {
  PurchaseBookDocument,
  PurchaseBookModel,
} from "../model/purchaseBookModel";

export class PurchaseBookService {
  addPurchaseToDB = async (info: Partial<PurchaseBookDocument>) => {
    const purchase = await PurchaseBookModel.create(info);
    return purchase.save();
  };
}
