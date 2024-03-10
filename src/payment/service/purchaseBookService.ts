import mongoose from "mongoose";
import { BookService } from "../../books/service/book.service";
import {
  TransactionModel,
  BookItem,
  TransactionDocument,
} from "../model/purchaseBookModel";

const Flutterwave = require("flutterwave-node-v3");

const publicKey = "FLWPUBK_TEST-7a2bbe12918b4723c06c5eccce75fd60-X";
const secretKey = "FLWSECK_TEST-2e0e5d8f56f4e7be25041fb6f46b7187-X";

let flutterwave = new Flutterwave(publicKey, secretKey);

const bookService = new BookService();
export class BookTransactionService {
  initiatePayment = async (
    paymentReferenceId: string,
    payload: TransactionDocument
  ) => {
    try {
      const response = await flutterwave.MobileMoney.ghana({
        tx_ref: paymentReferenceId,
        ...payload,
      });
      return response;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
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

  calculateTotalAmount = async (books: BookItem[]): Promise<any> => {
    const totalAmount = books.reduce(
      async (totalPromise: Promise<number>, book: BookItem) => {
        const total = await totalPromise;
        const bookId =
          typeof book.bookId === "string"
            ? book.bookId
            : book.bookId.toString();
        const booksFromDB = await bookService.getBooksByIds([bookId]);
        const bookFromDB = booksFromDB[0];
        if (!bookFromDB) {
          throw new Error(`Book with ID ${bookId} not found`);
        }
        return total + bookFromDB.bookPrice * book.quantity;
      },
      Promise.resolve(0)
    );

    return totalAmount;
  };

  createTransaction = async (transaction: Omit<TransactionDocument, "_id">) => {
    try {
      const newTransaction = new TransactionModel(transaction);
      await newTransaction.save();
      return newTransaction;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  //update transaction
  updateTransaction = async (
    transactionId: string,
    updateData: Partial<TransactionDocument>
  ) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        throw new Error("Invalid transactionId");
      }
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        updateData,
        { new: true }
      ).exec();
      return updatedTransaction;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  //get transaction by id
  getTransactionById = async (transactionId: string) => {
    try {
      const transaction = await TransactionModel.findById(transactionId).exec();
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
