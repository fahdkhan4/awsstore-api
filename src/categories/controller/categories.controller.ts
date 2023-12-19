import { Request, Response } from "express";
import { CategoryService } from "../service/category.service";

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id);

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories(
    Number(req.query.page),
    Number(req.query.per_page)
  );

  res.json(categories);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await categoryService.updateCategory(id, req.body);

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletionResult = await categoryService.deleteCategory(id);

  if (deletionResult) {
    res.json({
      message: "Category Deleted Successfully",
    });
  } else {
    res.status(404).json({ error: "Category not found" });
  }
};
