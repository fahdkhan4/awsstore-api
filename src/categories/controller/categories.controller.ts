import { Request, Response } from "express";
import { CategoryService } from "../service/category.service";

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const status = req.query.status === "draft" ? "draft" : "publish";
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string)
    : undefined;
  const size = req.query.size ? parseInt(req.query.size as string) : undefined;
  const lastObjectId = req.query.lastId as string;
  const name = req.query.name as string;
  const tags = req.query.tags as string[];

  const categories = await categoryService.getCategoryPaginatedFromDB({
    status,
    name,
    pageNumber,
    size,
    tags,
    lastObjectId,
  });

  res.status(200).json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await categoryService.deleteCategory(req.params.id);
  res.status(200).json(category);
};
