import mongoose, { Model, Document, Schema, Types } from "mongoose";
import { AuthDocument } from "../../auth/model/auth.model";
import { CategoryDocument } from "../../categories/model/category.model";

// todo: Add file system to it(bookFormate, bookSource, bookCover)

export interface BookDocument extends Document {
  _id: string;
  title: string;
  author: Types.ObjectId | AuthDocument; // Reference to the AuthModel
  genre: Types.ObjectId | CategoryDocument; //Reference to Category
  description: string;
  bookPrice: number;
  bookCurrency: string;
  bookFormate: string;
  bookFile: string;
  bookImageCover: string;
  pagesCount: number;
  language: string;
  publishYear: number;
  isPublic: boolean;
  status: "draft" | "review" | "published" | "rejected" | "deleted";
  isPublished?: boolean;
  isDeleted: boolean;
  review: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new mongoose.Schema<BookDocument>({
  title: { required: true, type: String },
  author: { required: true, type: Types.ObjectId, ref: "Auth" },
  genre: { required: true, type: Types.ObjectId, ref: "Book-Category" },
  description: { required: true, type: String },
  bookPrice: { required: true, type: Number },
  bookCurrency: { required: true, type: String },
  bookFormate: {
    type: String,
  },
  bookFile: {
    required: true,
    type: String,
  },
  bookImageCover: {
    required: true,
    type: String,
  },
  pagesCount: { required: true, type: Number },
  language: { required: true, type: String },
  publishYear: { required: true, type: Number },
  status: {
    type: String,
    required: true,
    enum: ["draft", "review", "published", "deleted"],
    default: "draft",
  },
  isPublic: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  review: { type: Number, default: 0 },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const BookModel = mongoose.model<BookDocument>("Book", BookSchema);
