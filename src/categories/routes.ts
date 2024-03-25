import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} from "./controller/categories.controller";

const router = Router();

//create a Category
router.post("/", handleAsyncErrors(createCategory));

//update a Category
router.put("/:id", handleAsyncErrors(updateCategory));

//get Categories
router.get("/", handleAsyncErrors(getCategories));

//delete a Category
router.delete("/:id", handleAsyncErrors(deleteCategory));

export default router;
