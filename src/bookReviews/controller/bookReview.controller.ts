import { Request, Response } from "express";
import { BookReviewService } from "../service/bookReview.service";

const bookReviewService = new BookReviewService();

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId, comment, userId } = req.body;
  const newBookReview = await bookReviewService.createComment(
    bookId,
    comment,
    userId
  );
  res.status(201).json(newBookReview);
};

export const createRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId, rating, userId } = req.body;
  const newBookReview = await bookReviewService.createRating(
    bookId,
    rating,
    userId
  );
  res.status(201).json(newBookReview);
};

export const getAllReviewsWithPagination = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pageNumber, size } = req.query;

  if (!pageNumber || !size) {
    res
      .status(400)
      .json({ error: "pageNumber and size are required parameters." });
    return;
  }

  const comments = await bookReviewService.getAllReviewsWithPagination(
    parseInt(pageNumber as string, 10),
    parseInt(size as string, 10)
  );

  res.status(200).json(comments);
};

export const getReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const comment = await bookReviewService.getReview(id);
  res.status(200).json(comment);
};

export const estimatedRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId } = req.params;
  const rating = await bookReviewService.estimateRating(bookId);
  res.status(200).json(rating);
};
