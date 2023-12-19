import mongoose, {  Document } from "mongoose";

export interface CategoryDocument extends Document {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<CategoryDocument>({
  name: { required: true, type: String, index: true, unique: true },
  description: { required: true, type: String },
  tags: [{ type: String }],
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const CategoryModel = mongoose.model<CategoryDocument>(
  "Category",
  categorySchema
);
