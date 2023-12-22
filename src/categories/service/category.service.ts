import mongoose, { Document, Query, Types } from "mongoose";
import { CategoryDocument, CategoryModel } from "../model/category.model";

const PAGE_SIZE = 50;

export class CategoryService {
  getCategoryPaginationQuery = ({
    query,
    pageNumber = 1,
    size = PAGE_SIZE,
    lastObjectId,
  }: {
    query: Query<CategoryDocument[], CategoryDocument>;
    pageNumber?: number;
    size?: number;
    lastObjectId?: string;
  }) => {
    if (!lastObjectId && pageNumber) {
      query.skip(size * (pageNumber - 1));
    }

    if (lastObjectId) {
      query.gt("_id", new Types.ObjectId(lastObjectId));
    }

    return query.limit(size);
  };

  getCategoryPaginatedFromDB = async ({
    status,
    name,
    pageNumber = 1,
    size = PAGE_SIZE,
    tags,
    lastObjectId,
  }: {
    status: string;
    tags?: string[];
    size?: number;
    name?: string;
    pageNumber?: number;
    lastObjectId?: string;
  }): Promise<Document[]> => {
    let queryFilter: Record<string, string | any> = { status };

    if (name) queryFilter.name = new RegExp(name, "i");

    if (tags && Array.isArray(tags)) {
      const tagsPattern = tags.map((tag) => `(${tag})`).join("|");
      queryFilter.tags = new RegExp(tagsPattern, "i");
    } else if (tags) {
      queryFilter.tags = new RegExp(tags, "i");
    }

    const query = CategoryModel.find(queryFilter);

    const queryWithPagination = this.getCategoryPaginationQuery({
      query,
      size,
      pageNumber,
      lastObjectId,
    });

    const categories = await queryWithPagination.exec();

    return categories;
  };

  getCategoryById = async (categoryId: string) => {
    let result = null;

    try {
      result = await CategoryModel.findOne({ _id: categoryId }).lean();
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  createCategory = async (
    categoryData: Omit<CategoryDocument, "_id">
  ): Promise<CategoryDocument> => {
    const category = await CategoryModel.create(categoryData);
    return category;
  };

  updateCategory = async (
    categoryId: string,
    updatedDetails: Partial<CategoryDocument>
  ): Promise<CategoryDocument | null> => {
    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...updatedDetails,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();
    return category;
  };

  deleteCategory = async (categoryId: string): Promise<boolean> => {
    const result = await CategoryModel.findByIdAndDelete(categoryId).exec();
    return !!result;
  };
}
