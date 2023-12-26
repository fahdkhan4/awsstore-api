import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createBook,
  getPaginatedBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  reviewBookById,
} from "./controller/book.controller";
import { createBookValidatorMiddleware } from "./book.validator";
import { authenticate } from "../middleware/authenticateMiddleware";

const router = Router();

//Create A Book
router.post(
  "/",
  [createBookValidatorMiddleware],
  handleAsyncErrors(createBook)
);

//Filter Through Books
router.get("/", handleAsyncErrors(getPaginatedBooks));

//Get a Book By Id
router.get("/:id", handleAsyncErrors(getBookById));

//Update a Book By Id
router.put("/:id", handleAsyncErrors(updateBookById));

//Delete a Book By Id
router.delete("/:id", handleAsyncErrors(deleteBookById));

//Admin Functions (Review Books)
router.put("/review/:id", handleAsyncErrors(reviewBookById));

export default router;
