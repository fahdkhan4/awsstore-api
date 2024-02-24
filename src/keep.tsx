import { Request, Response } from "express";
import { BookService } from "../../books/service/book.service";
import { UserService } from "../../users/service/user.service";
import { PurchaseBookService } from "../service/purchaseBookService";
import { BookDocument } from "../../books/model/book.model";
const Flutterwave = require("flutterwave-node-v3");

const publicKey = "FLWPUBK_TEST-7a2bbe12918b4723c06c5eccce75fd60-X";
const secretKey = "FLWSECK_TEST-2e0e5d8f56f4e7be25041fb6f46b7187-X";

let flutterwave = new Flutterwave(publicKey, secretKey);

const bookService = new BookService();
const userService = new UserService();
const purchaseBookService = new PurchaseBookService();

export const initiateBookPurchase = async (req: Request, res: Response) => {
  const { userId, purchases } = req.body;

  if (!userId) throw new Error("userId is missing in the request body");

  const purchaseBookIds = purchases.map((purchase: any) => {
    return purchase.bookId;
  });

  const booksFromDB = await bookService.getBooksByIds(purchaseBookIds);

  //calculate total Book Amount
  const totalAmount = purchases.reduce((total: number, purchase: any) => {
    const foundBook = booksFromDB.find(
      (p) => p._id.toString() === purchase.bookId
    );

    if (!foundBook) throw new Error("One of the products was not found");

    const currentPrice = foundBook.bookPrice * purchase.quantity;

    return total + currentPrice;
  }, 0);

  //get userId
  const user = await userService.getUserById(userId);

  //construct payment
  const purchaseDate = new Date().toISOString().split("T")[0];
  const paymentData = {
    tx_ref: "test789",
    amount: totalAmount,
    currency: "GHS",
    voucher: "143256743",
    network: "VODAFONE",
    email: "stefan.wexler@hotmail.eu",
    phone_number: "054709929220",
    fullname: "Yolande Aglaé Colbert",
    client_ip: "154.123.220.1",
    device_fingerprint: "62wd23423rq324323qew1",
    meta: {
      flightID: "213213AS",
      anotherBanger: "Rema or Spyce :)",
    },
  };

  const response = await flutterwave.MobileMoney.ghana(paymentData);

  const createPurchaseBook = await purchaseBookService.addPurchaseToDB({
    user: userId,
    books: purchases,
    totalAmount,
  });

  res.status(200).json({ response, createPurchaseBook });
};

export const verifyPayment = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Payment Verified" });
};
