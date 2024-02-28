import { Request, Response } from "express";
import { BookTransactionService } from "../service/purchaseBookService";
import { BookItem, PaymentStatusEnums } from "../model/purchaseBookModel";
import { BookService } from "../../books/service/book.service";
import uniqid from "uniqid";

const bookTransactionService = new BookTransactionService();
const bookService = new BookService();

export const initiateBookPurchase = async (req: Request, res: Response) => {
  try {
    const { userId, books, paymentDetails } = req.body;

    const totalAmount = await bookTransactionService.calculateTotalAmount(
      books
    );

    paymentDetails.amount = totalAmount;
    paymentDetails.meta = {
      userId: userId,
      books: books.map((item: BookItem) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      })),
      totalAmount: totalAmount,
    };

    const paymentReferenceId = uniqid();

    const paymentResponse = await bookTransactionService.initiatePayment(
      paymentReferenceId,
      paymentDetails
    );

    const updatedBooks = await Promise.all(
      books.map(async (bookItem: any) => {
        const bookDetails = await bookService.getBookById(bookItem.bookId);

        if (!bookDetails) return null;

        return {
          book: {
            id: bookItem.bookId,
            title: bookDetails.title,
            description: bookDetails.description,
            price: {
              currency: bookDetails.bookCurrency,
              amount: bookDetails.bookPrice,
            },
          },
          quantity: bookItem.quantity,
        };
      })
    );

    const bookPaymentData = {
      userId: userId,
      paymentReferenceId: paymentReferenceId,
      status: PaymentStatusEnums.PENDING,
      totalAmount: {
        currency: paymentDetails.currency,
        amount: totalAmount,
      },
      books: updatedBooks,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentDateTime: new Date().toISOString(),
      paymentHistory: [
        {
          statusFrom: PaymentStatusEnums.PENDING,
          statusTo: PaymentStatusEnums.PENDING,
          date: new Date().toISOString(),
        },
      ],
    };

    if (
      paymentResponse.status === "success" &&
      paymentResponse.meta?.authorization.mode === "redirect"
    ) {
      await bookTransactionService.createTransaction(bookPaymentData);
      return res.status(200).json({
        message: "Please complete the payment verification",
        redirectUrl: paymentResponse.meta.authorization.redirect,
      });
    } else if (paymentResponse.status === "success") {
      const transactionId = paymentResponse.data.id;

      const verificationResponse = await bookTransactionService.verifyPayment(
        transactionId
      );

      if (verificationResponse.status === "success") {
        const transactionData = {
          user: userId,
          books: books,
          paymentMode: paymentDetails.paymentMode,
          totalAmount: totalAmount,
        };

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
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred during the book purchase process",
      error: error.message,
    });
  }
};
