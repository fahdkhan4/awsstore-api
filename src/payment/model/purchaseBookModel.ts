import mongoose, { Types } from "mongoose";
import { BookDocument } from "../../books/model/book.model";
import { AuthDocument } from "../../auth/model/auth.model";

// create enum for payment status
export enum PaymentStatusEnums {
  PENDING = "pending",
  SUCCESS = "successful",
  FAILED = "failed",
}

export const PaymentStatus = [
  PaymentStatusEnums.PENDING,
  PaymentStatusEnums.SUCCESS,
  PaymentStatusEnums.FAILED,
];

type PaymentHistory = {
  statusFrom: PaymentStatusEnums;
  statusTo: PaymentStatusEnums;
  date: string;
};

export interface BookItem {
  bookId: Types.ObjectId | BookDocument;
  quantity: number;
}

export interface TransactionDocument {
  _id: string;
  userId: Types.ObjectId | AuthDocument;
  paymentReferenceId: string;
  status: PaymentStatusEnums;
  totalAmount: {
    currency: string;
    amount: number;
  };
  paymentDetails?: {
    transactionId: string;
    paymentMode: string;
    transactionIp: string;
    paymentStatus: PaymentStatusEnums;
    paymentType: string;
    accountId: string;
    paymentDate: string;
    userName: string;
    phoneNumber: string;
    email: string;
    currency: string;
    amount: number;
  };
  books: {
    books: BookDocument;
    quantity: number;
  }[];
  paymentDate: string;
  paymentDateTime: string;
  paymentHistory?: PaymentHistory[];
}

const PaymentHistorySchema = new mongoose.Schema<PaymentHistory>({
  statusFrom: { required: true, type: String, enum: PaymentStatus },
  statusTo: { required: true, type: String, enum: PaymentStatus },
  date: { required: true, type: String },
});

const paymentDetailsSchema = new mongoose.Schema({
  transactionId: { required: true, type: String },
  paymentMode: { required: true, type: String },
  transactionIp: { required: true, type: String },
  paymentStatus: { required: true, type: String, enum: PaymentStatus },
  paymentType: { required: true, type: String },
  accountId: { required: true, type: String },
  paymentDate: { required: true, type: String },
  userName: { required: true, type: String },
  phoneNumber: { required: true, type: String },
  email: { required: true, type: String },
  currency: { required: true, type: String },
  amount: { required: true, type: Number },
});

const bookSchema = new mongoose.Schema({
  id: { required: true, type: String },
  title: { required: true, type: String },
  description: { required: true, type: String },
  price: {
    currency: { required: true, type: String },
    amount: { required: true, type: Number },
  },
});

const BookQuantitySchema = new mongoose.Schema<{
  book: BookDocument;
  quantity: number;
}>(
  {
    book: { required: true, type: bookSchema },
    quantity: { required: true, type: Number },
  },
  { _id: false }
);

const schema = new mongoose.Schema<TransactionDocument>(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "User",
    },
    status: { required: true, type: String, enum: PaymentStatus, index: true },
    paymentReferenceId: { required: true, type: String, index: true },
    totalAmount: {
      currency: { required: true, type: String },
      amount: { required: true, type: Number },
    },
    paymentDetails: paymentDetailsSchema,
    books: [BookQuantitySchema],
    paymentDate: { required: true, type: String, index: true },
    paymentDateTime: { required: true, type: String },
    paymentHistory: [PaymentHistorySchema],
  },
  { timestamps: true }
);

schema.index({ paymentDate: 1, status: 1 });

export const TransactionModel = mongoose.model("Transaction", schema);
