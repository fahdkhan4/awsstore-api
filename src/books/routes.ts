import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import multer from "multer";
import {
  createBook,
  getPaginatedBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  reviewBookById,
} from "./controller/book.controller";
import {
  createBookValidatorMiddleware,
  getPaginatedBooksMiddleware,
  updateBookValidatorMiddleware,
} from "./book.validator";
import { authenticate } from "../middleware/authenticateMiddleware";
import { isAdmin } from "../middleware/roleCheckerMiddleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

//Create A Book
router.post(
  "/",
  [
    upload.fields([{ name: "bookSource" }, { name: "bookImageCover" }]),
    authenticate,
    createBookValidatorMiddleware,
  ],
  handleAsyncErrors(createBook)
);

//Filter Through Books
router.get(
  "/",
  [authenticate, getPaginatedBooksMiddleware],
  handleAsyncErrors(getPaginatedBooks)
);

//Get a Book By Id
router.get("/:id", [authenticate], handleAsyncErrors(getBookById));

//Update a Book By Id
router.put(
  "/:id",
  [authenticate, updateBookValidatorMiddleware],
  handleAsyncErrors(updateBookById)
);

//Delete a Book By Id
router.delete("/:id", [authenticate], handleAsyncErrors(deleteBookById));

//Admin Functions (Review Books)
router.put(
  "/review/:id",
  [isAdmin, authenticate],
  handleAsyncErrors(reviewBookById)
);

export default router;
