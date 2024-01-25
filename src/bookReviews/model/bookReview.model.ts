import mongoose, { Model, Document, Schema, Types } from "mongoose";
import { AuthDocument } from "../../auth/model/auth.model";
import { BookDocument } from "../../books/model/book.model";

export interface BookReviewDocument extends Document {
  _id: string;
  book: Types.ObjectId | BookDocument;
  user: Types.ObjectId | AuthDocument;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookReviewSchema = new mongoose.Schema<BookReviewDocument>({
  book: { required: true, type: Types.ObjectId, ref: "Book" },
  user: { required: true, type: Types.ObjectId, ref: "User" },
  comment: { type: String },
  rating: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const BookReviewModel = mongoose.model<BookReviewDocument>(
  "Book-Review",
  BookReviewSchema
);
