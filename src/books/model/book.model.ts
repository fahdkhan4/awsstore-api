import mongoose, { Model, Document, Types } from "mongoose";
import { AuthDocument } from "../../auth/model/auth.model";
import { CategoryDocument } from "../../categories/model/category.model";

export interface BookDocument extends Document {
  _id: string;
  title: string;
  author: Types.ObjectId | AuthDocument; // Reference to the AuthModel
  category: Types.ObjectId | CategoryDocument; //Reference to Category
  description: string;
  bookAmount: {
    price: number;
    currency: string;
  };
  bookFormate?: string;
  bookFileUrl: string;
  bookImageCoverUrl: string;
  pagesCount?: number;
  language: string;
  publishYear: number;
  status: "draft" | "review" | "published" | "rejected" | "deleted";
  isPublished: boolean;
  review: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new mongoose.Schema<BookDocument>({
  title: { required: true, type: String },
  author: { required: true, type: Types.ObjectId, ref: "Auth" },
  category: { required: true, type: Types.ObjectId, ref: "Book-Category" },
  description: { required: true, type: String },
  bookAmount: {
    price: { required: true, type: Number },
    currency: { required: true, type: String },
  },
  bookFormate: {
    type: String,
  },
  bookFileUrl: {
    required: true,
    type: String,
  },
  bookImageCoverUrl: {
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
  isPublished: { type: Boolean, default: false },
  review: { type: Number, default: 0 },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const BookModel = mongoose.model<BookDocument>("Book", BookSchema);
