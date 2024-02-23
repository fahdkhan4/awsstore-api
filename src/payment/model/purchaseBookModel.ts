//Purchase Book Model Logic
import mongoose, { Model, Document, Schema, Types } from "mongoose";
import { BookDocument } from "../../books/model/book.model";
import { AuthDocument } from "../../auth/model/auth.model";

export interface BookPurchase {
  bookId: Types.ObjectId | BookDocument;
  quantity: number;
}

export interface PurchaseBookDocument extends Document {
  _id: string;
  user: Types.ObjectId | AuthDocument;
  books: BookPurchase[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookPurchaseSchema = new Schema({
  bookId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const PurchaseBookSchema = new Schema({
  user: { type: String, required: true },
  books: [BookPurchaseSchema],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const PurchaseBookModel = mongoose.model<PurchaseBookDocument>(
  "PurchaseBook",
  PurchaseBookSchema
);
