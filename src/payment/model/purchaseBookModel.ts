import mongoose, { Schema, Document, Types } from "mongoose";
import { BookDocument } from "../../books/model/book.model";
import { AuthDocument } from "../../auth/model/auth.model";

//todo: add buyerName, phone_number, email, created_at, transaction Id
export interface BookItem {
  bookId: Types.ObjectId | BookDocument;
  quantity: number;
}

export interface TransactionData {
  user: Types.ObjectId | string;
  books: BookItem[];
  paymentMode: string;
  totalAmount: number;
}
export interface TransactionDocument extends Document {
  _id: string;
  user: Types.ObjectId | AuthDocument;
  books: BookItem[];
  paymentMode: string;
  totalAmount: number;
  transactionDate?: Date;
}

const BookItemSchema = new Schema<BookItem>({
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true },
});

const TransactionSchema = new Schema<TransactionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    books: [BookItemSchema],
    paymentMode: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<TransactionDocument>(
  "BookTransaction",
  TransactionSchema
);
