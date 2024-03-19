import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createBook,
  updateBook,
  getBooks,
  deleteBook,
} from "./controller/book.controller";

const router = Router();

//create a Book
router.post("/", handleAsyncErrors(createBook));

//update a Art
router.put("/:id", handleAsyncErrors(updateBook));

//get Arts
router.get("/", getBooks);

//delete a Art
router.delete("/:id", handleAsyncErrors(deleteBook));

export default router;
