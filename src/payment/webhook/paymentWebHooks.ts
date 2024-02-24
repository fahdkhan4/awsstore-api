import { Request, Response } from "express";
import { BookTransactionService } from "../service/purchaseBookService";
import { BookItem } from "../model/purchaseBookModel";
import { BookService } from "../../books/service/book.service";

const bookTransactionService = new BookTransactionService();
const bookService = new BookService();

export const ghanaMobileMoneyHook = async (req: Request, res: Response) => {
  const event = req.body;

  if (
    event.event === "charge.completed" &&
    event.data.status === "successful"
  ) {
    console.log(event.meta);
    const transactionId = event.data.id;
    const userId = event.data.meta.userId;
    const books = event.data.meta.books;
    const totalAmount = event.data.amount;
    const paymentMode = event.data.auth_model;

    // // // Perform necessary updates and create a transaction record
    // // await updateSellerBalances(books);
    // // await addBooksToBuyerCollection(userId, books);

    const transactionData = {
      user: userId,
      books: books,
      paymentMode: paymentMode,
      totalAmount: totalAmount,
    };

    await bookTransactionService.createTransaction(transactionData);
  }

  res.status(200).send("Webhook received");
};
