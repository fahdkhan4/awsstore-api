import { Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import { CategoryDocument } from "../model/category.model";
import { FilterQuery } from "mongoose";

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  const { adminId, ...categoryData } = req.body;

  const newCategory = await categoryService.createCategory(
    adminId,
    categoryData
  );

  res.status(201).json(newCategory);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id: categoryId } = req.params;
  const { ...updateData } = req.body;

  const updatedCategory = await categoryService.updateCategory(
    categoryId,
    updateData
  );

  if (!updatedCategory)
    return res.status(404).json({ message: "Category not found" });

  res.status(200).json(updatedCategory);
};

export const getCategories = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, ...query } = req.query;
  let id;
  if (query.id) id = query._id;

  const queryParams: FilterQuery<CategoryDocument> = {};

  Object.keys(query).forEach((key) => {
    queryParams[key] = query[key];
  });

  const categories = await categoryService.getCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    query: queryParams,
  });

  res.status(200).json(categories);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedCategory = await categoryService.deleteCategory(id);
  res.status(200).json(deletedCategory);
};
