import { Request, Response } from "express";
import { BookTransactionService } from "../service/purchaseBookService";
import { BookService } from "../../books/service/book.service";
import { UserService } from "../../users/service/user.service";
import mongoose from "mongoose";

const bookTransactionService = new BookTransactionService();
const bookService = new BookService();
const userService = new UserService();

export const ghanaMobileMoneyHook = async (req: Request, res: Response) => {
  const event = req.body;

  if (
    event.event === "charge.completed" &&
    event.data.status === "successful"
  ) {
    const transactionId = event.data.id;
    const userId = event.data.meta.userId;
    const books = event.data.meta.books;
    const totalAmount = event.data.amount;
    const paymentMode = event.data.auth_model;

    const transactionData = {
      user: userId,
      books: books,
      paymentMode: paymentMode,
      totalAmount: totalAmount,
    };

    await bookTransactionService.createTransaction(transactionData);

    // Update the seller's account balance for each book sold
    for (const book of books) {
      const bookDetails = await bookService.getBookById(book.bookId);
      if (bookDetails && bookDetails.author) {
        const sellerId =
          bookDetails.author instanceof mongoose.Types.ObjectId
            ? bookDetails.author.toString()
            : bookDetails.author._id.toString();
        await userService.updateSellerAccountBalance(
          sellerId,
          book.quantity * bookDetails.bookPrice
        );
        await userService.updateSellerBooksSold(sellerId, book.bookId);
      }
    }

    await userService.updateBuyerBooksBought(
      userId,
      books.map((book: any) => book.bookId)
    );
  }

  res.status(200).send("Webhook received");
};
