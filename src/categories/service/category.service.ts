import mongoose, { FilterQuery } from "mongoose";
import { CategoryDocument, CategoryModel } from "../model/category.model";
import { UserService } from "../../users/service/user.service";
import { sendCategoryCreationState } from "../../emails/categories/sendCategoryState.email";

const userService = new UserService();
interface BookQueryParams {
  page: number;
  limit: number;
  query: FilterQuery<CategoryDocument>;
}

export class CategoryService {
  getCategories = async ({
    page,
    limit,
    query,
  }: BookQueryParams): Promise<CategoryDocument[]> => {
    console.log("i got the request from favourite", query);
    const categories = await CategoryModel.find(query)
      .skip((page - 1) * limit)
      .exec();

    return categories;
  };

  // Create a new category
  createCategory = async (
    adminId: string,
    categoryData: Partial<CategoryDocument>
  ): Promise<CategoryDocument> => {
    if (!mongoose.Types.ObjectId.isValid(adminId))
      throw new Error("Invalid adminId");

    // Check if the corresponding documents (admin) exist
    const admin = await userService.getUserById(adminId);

    if (!admin) throw new Error("Admin not found");

    if (admin.role !== "admin")
      throw new Error("Invalid adminId, only admin can create category");

    const categoryWithReferences = {
      ...categoryData,
      adminId: admin._id,
      status: "publish",
    };

    const category = await CategoryModel.create(categoryWithReferences);

    sendCategoryCreationState({
      state: category.status as string,
      categoryTitle: category.name as string,
      tags: category.tags as string[],
    });

    return category;
  };

  // Update a category by id
  updateCategory = async (
    categoryId: string,
    updateData: Partial<CategoryDocument>
  ): Promise<CategoryDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(categoryId))
      throw new Error("Invalid categoryId");

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    ).exec();

    return updatedCategory;
  };

  // Delete a category by id
  deleteCategory = async (
    categoryId: string
  ): Promise<CategoryDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(categoryId))
      throw new Error("Invalid categoryId");

    const deletedCategory = await CategoryModel.findByIdAndDelete(
      categoryId
    ).exec();

    return deletedCategory;
  };
}
