import mongoose, { Model, Document, Types } from "mongoose";
import { AuthDocument } from "../../auth/model/auth.model";
import { CategoryDocument } from "../../categories/model/category.model";

export interface ArtDocument extends Document {
  _id: string;
  title: string;
  author: Types.ObjectId | AuthDocument; // Reference to the AuthModel
  category: Types.ObjectId | CategoryDocument; // Reference to the AuthModel
  description: string;
  artAmount: {
    price: number;
    currency: string;
  };
  artImage: string[];
  isPublic: boolean;
  status: "draft" | "review" | "published" | "rejected" | "deleted";
  isPublished?: boolean;
  isDeleted: boolean;
  review: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArtSchema = new mongoose.Schema<ArtDocument>({
  title: { required: true, type: String },
  author: { required: true, type: Types.ObjectId, ref: "Auth" },
  category: { required: true, type: Types.ObjectId, ref: "Book-Category" },
  description: { required: true, type: String },
  artAmount: {
    price: { required: true, type: Number },
    currency: { required: true, type: String },
  },
  artImage: {
    required: true,
    type: [String],
  },
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

export const ArtModel: Model<ArtDocument> = mongoose.model("Art", ArtSchema);
