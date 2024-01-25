import { Router } from "express";
import {
  createCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./controller/categories.controller";
import { isAdmin } from "../middleware/roleCheckerMiddleware";
import { authenticate } from "../middleware/authenticateMiddleware";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  addProductCategoryValidatorMiddleware,
  getPaginatedProductCategoriesMiddleware,
  updateProductCategoryValidatorMiddleware,
} from "./category.validator";

const router = Router();

router.post(
  "",
  [isAdmin, authenticate, addProductCategoryValidatorMiddleware],
  handleAsyncErrors(createCategory)
);

router.get("/:id", authenticate, handleAsyncErrors(getCategoryById));

router.get(
  "",
  [authenticate, getPaginatedProductCategoriesMiddleware],
  handleAsyncErrors(getCategories)
);

router.put(
  "/:id",
  [isAdmin, authenticate, updateProductCategoryValidatorMiddleware],
  handleAsyncErrors(updateCategory)
);

router.delete(
  "/:id",
  [isAdmin, authenticate],
  handleAsyncErrors(deleteCategory)
);

export default router;
