import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createBook,
  updateBook,
  getBooks,
  deleteBook,
} from "./controller/book.controller";
import {
  createBookValidatorMiddleware,
  getBooksMiddleware,
  updateBookValidatorMiddleware,
} from "./book.validator";

const router = Router();

//create a Book
router.post("/", createBookValidatorMiddleware, handleAsyncErrors(createBook));

//update a Art
router.put(
  "/:id",
  updateBookValidatorMiddleware,
  handleAsyncErrors(updateBook)
);

//get Arts
router.get("/", getBooks);

//delete a Art
router.delete("/:id", handleAsyncErrors(deleteBook));

export default router;
