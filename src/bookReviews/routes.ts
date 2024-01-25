import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createComment,
  createRating,
  estimatedRating,
  getAllReviewsWithPagination,
  getReview,
} from "./controller/bookReview.controller";

// todo: Fix Estimated Rating

const router = Router();

//Create A Comment
router.post("/comment", handleAsyncErrors(createComment));

//Create A Rating
router.post("/rating", handleAsyncErrors(createRating));

//Get all comment with pagination
router.get("/comment", handleAsyncErrors(getAllReviewsWithPagination));

//Get a comment
router.get("/:id", handleAsyncErrors(getReview));

//Get estimated Rating for a book
router.get("/estimatedRating/:id", handleAsyncErrors(estimatedRating));

export default router;
