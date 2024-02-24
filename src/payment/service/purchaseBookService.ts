import {
  TransactionDocument,
  BookItem,
  TransactionModel,
  TransactionData,
} from "../model/purchaseBookModel";

const Flutterwave = require("flutterwave-node-v3");
const Payload = require("flutterwave-node-v3");

const publicKey = "FLWPUBK_TEST-7a2bbe12918b4723c06c5eccce75fd60-X";
const secretKey = "FLWSECK_TEST-2e0e5d8f56f4e7be25041fb6f46b7187-X";

let flutterwave = new Flutterwave(publicKey, secretKey);

export class BookTransactionService {
  initiatePayment = async (payload: typeof Payload) => {
    try {
      const response = await flutterwave.MobileMoney.ghana(payload);
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  verifyPayment = async (transactionId: string) => {
    try {
      const response = await flutterwave.Transaction.verify(transactionId);
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  createTransaction = async (transaction: TransactionData) => {
    try {
      const newTransaction = new TransactionModel(transaction);
      await newTransaction.save();
      return newTransaction;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
