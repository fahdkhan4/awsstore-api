import mongoose, { Document } from "mongoose";

export interface CategoryDocument extends Document {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  status: "publish" | "draft" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<CategoryDocument>({
  name: { required: true, type: String, index: true, unique: true },
  description: { required: true, type: String },
  tags: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ["publish", "draft", "deleted"],
    default: "draft",
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const CategoryModel = mongoose.model<CategoryDocument>(
  "Book-Category",
  categorySchema
);
