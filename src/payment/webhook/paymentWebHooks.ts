import { Request, Response } from "express";
import { BookTransactionService } from "../service/purchaseBookService";
import { BookService } from "../../books/service/book.service";
import { UserService } from "../../users/service/user.service";
import mongoose from "mongoose";
import { PaymentStatusEnums } from "../model/purchaseBookModel";

const bookTransactionService = new BookTransactionService();
const bookService = new BookService();
const userService = new UserService();

export const ghanaMobileMoneyHook = async (req: Request, res: Response) => {
  const event = req.body;

  if (
    event.event === "charge.completed" &&
    event.data.status === "successful"
  ) {
    const chargedAmount = event.data.charged_amount;
    const paymentMode = event.data.payment_type;
    const userIp = event.data.ip;
    const paymentStatus = event.data.status;
    const paymentType = event.data.payment_type;
    const accountId = event.data.account_id;
    const paymentDate = event.data.created_at;
    const userName = event.data.customer.name;
    const phone_number = event.data.customer.phone_number;
    const email = event.data.customer.email;
    const totalAmount = event.data.amount;

    const transaction = await bookTransactionService.getTransactionById(
      event.data.id.toString()
    );

    if (!transaction) return res.status(404).send("Transaction not found");

    const newPaymentStatus = PaymentStatusEnums.SUCCESS;

    const transactionToUpdate = {
      status: newPaymentStatus,
      paymentDetails: {
        transactionId: event.data.id,
        paymentMode,
        transactionIp: userIp,
        paymentStatus,
        paymentType,
        accountId,
        paymentDate,
        userName,
        phoneNumber: phone_number,
        email,
        currency: event.data.currency,
        amount: totalAmount,
      },
      paymentHistory: [
        ...(transaction.paymentHistory || []),
        {
          statusFrom: transaction.status,
          statusTo: newPaymentStatus,
          date: new Date().toISOString(),
        },
      ],
    };

    const updatedTransaction = await bookTransactionService.updateTransaction(
      transaction._id,
      transactionToUpdate
    );

    if (!updatedTransaction)
      return res.status(500).send("Failed to update transaction");

    //Update Seller Account information
    for (const bookItem of transaction.books) {
      const bookId = (bookItem as any).book.id;
      const book = await bookService.getBookById(bookId.toString());
      if (book && book.author) {
        const sellerId =
          book.author instanceof mongoose.Types.ObjectId
            ? book.author._id.toHexString()
            : book.author._id.toString();

        await userService.updateSellerAccountBalance(sellerId, book.bookPrice);
      }
    }

    //Update User Books Bought
    await userService.updateBuyerBooksBought(
      transaction.userId.toString(),
      transaction.books.map((bookItem: any) => bookItem.book.id)
    );
  }

  res.status(200).send("Webhook received");
};
