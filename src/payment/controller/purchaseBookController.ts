import { Request, Response } from "express";
import { BookTransactionService } from "../service/purchaseBookService";
import { BookItem } from "../model/purchaseBookModel";
import { BookService } from "../../books/service/book.service";

const bookTransactionService = new BookTransactionService();
const bookService = new BookService();

export const initiateBookPurchase = async (req: Request, res: Response) => {
  const { userId, books, paymentDetails } = req.body;

  const purchaseBookIds = books.map((book: BookItem) => book.bookId);
  const booksFromDB = await bookService.getBooksByIds(purchaseBookIds);

  const totalAmount = books.reduce((total: number, purchase: BookItem) => {
    const foundBook = booksFromDB.find(
      (book) => book._id.toString() === purchase.bookId.toString()
    );

    if (!foundBook) throw new Error("One of the books was not found");

    const currentPrice = foundBook.bookPrice * purchase.quantity;

    return total + currentPrice;
  }, 0);

  paymentDetails.amount = totalAmount;
  paymentDetails.meta = {
    userId: userId,
    books: books.map((item: BookItem) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    })),
    totalAmount: totalAmount,
  };

  const paymentResponse = await bookTransactionService.initiatePayment(
    paymentDetails
  );

  if (
    paymentResponse.status === "success" &&
    paymentResponse.meta.authorization.mode === "redirect"
  ) {
    return res.status(200).json({
      message: "Please complete the CAPTCHA verification",
      redirectUrl: paymentResponse.meta.authorization.redirect,
    });
  } else if (paymentResponse.status === "success") {
    const transactionId = paymentResponse.meta.authorization.transaction_id;

    const verificationResponse = await bookTransactionService.verifyPayment(
      transactionId
    );

    if (verificationResponse.status === "success") {
      const transactionData = {
        user: userId,
        books: books.map((item: BookItem) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
        paymentMode: "mobileMoney",
        totalAmount: totalAmount,
      };

      // Pass this object to the createTransaction method.
      const savedTransaction = await bookTransactionService.createTransaction(
        transactionData
      );

      return res.status(200).json({
        message: "Books purchased successfully",
        data: savedTransaction,
      });
    } else {
      return res.status(400).json({
        message: "Payment verification failed",
        details: verificationResponse,
      });
    }
  } else {
    return res.status(400).json({
      message: "Payment initiation failed",
      details: paymentResponse,
    });
  }
};
