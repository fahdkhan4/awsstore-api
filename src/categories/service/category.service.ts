import { CategoryDocument, CategoryModel } from "../model/category.model";

export class CategoryService {
  async createCategory(
    categoryData: Omit<CategoryDocument, "_id">
  ): Promise<CategoryDocument> {
    const category = await CategoryModel.create(categoryData);
    return category;
  }

  async getCategoryById(categoryId: string): Promise<CategoryDocument | null> {
    return await CategoryModel.findById(categoryId).exec();
  }

  async getAllCategories(
    page: number = 1,
    perPage: number = 10
  ): Promise<CategoryDocument[]> {
    const categories = await CategoryModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return categories;
  }

  async updateCategory(
    categoryId: string,
    updatedDetails: Partial<CategoryDocument>
  ): Promise<CategoryDocument | null> {
    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...updatedDetails,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();
    return category;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(categoryId).exec();
    return !!result;
  }
}
