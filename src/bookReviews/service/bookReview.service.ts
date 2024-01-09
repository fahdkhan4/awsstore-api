import mongoose from "mongoose";
import { BookReviewModel, BookReviewDocument } from "../model/bookReview.model";
import { BookModel } from "../../books/model/book.model";
import { AuthModel } from "../../auth/model/auth.model";

// const PAGE_SIZE = 50;

export class BookReviewService {
  //create comment
  createComment = async (
    bookId: string,
    comment: string,
    userId: string
  ): Promise<BookReviewDocument | null> => {
    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    )
      throw new Error("Invalid bookId or userId");

    const [book, user] = await Promise.all([
      BookModel.findById(bookId),
      AuthModel.findById(userId),
    ]);

    if (!book || !user) throw new Error("Book or user not found");

    const filter = { book: book._id, user: user._id };

    const update = {
      $set: {
        book: book._id,
        user: user._id,
        comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const result = await BookReviewModel.updateOne(filter, update, options);

    if (result.upsertedId) return BookReviewModel.findById(result.upsertedId);
    else return BookReviewModel.findOne(filter);
  };

  //create rating
  createRating = async (
    bookId: string,
    rating: string,
    userId: string
  ): Promise<BookReviewDocument | null> => {
    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    )
      throw new Error("Invalid bookId or userId");

    const [book, user] = await Promise.all([
      BookModel.findById(bookId),
      AuthModel.findById(userId),
    ]);

    if (!book || !user) throw new Error("Book or user not found");

    const filter = { book: book._id, user: user._id };

    const update = {
      $set: {
        book: book._id,
        user: user._id,
        rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const result = await BookReviewModel.updateOne(filter, update, options);

    if (result.upsertedId) {
      return BookReviewModel.findById(result.upsertedId);
    } else {
      return BookReviewModel.findOne(filter);
    }
  };

  //get a comment
  getReview = async (commentId: string): Promise<BookReviewDocument> => {
    if (!mongoose.Types.ObjectId.isValid(commentId))
      throw new Error("Invalid commentId");

    const comment = await BookReviewModel.findById(commentId);

    if (!comment) throw new Error("Comment not found");

    return comment;
  };

  //get all comments with Pagination
  getAllReviewsWithPagination = async (
    pageNumber: number,
    size: number
  ): Promise<BookReviewDocument[]> => {
    const skip = (pageNumber - 1) * size;

    const comments = await BookReviewModel.find()
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });

    return comments;
  };

  //delete a comment
  deleteReview = async (commentId: string): Promise<BookReviewDocument> => {
    if (!mongoose.Types.ObjectId.isValid(commentId))
      throw new Error("Invalid commentId");

    const comment = await BookReviewModel.findByIdAndDelete(commentId);

    if (!comment) throw new Error("Comment not found");

    return comment;
  };

  //estimate rating of a book
  estimateRating = async (bookId: string): Promise<number> => {
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error("Invalid bookId");

    const ratings = await BookReviewModel.find({ book: bookId });

    if (!ratings) throw new Error("Ratings not found");

    const totalRating = ratings.reduce((acc, rating) => {
      return acc + rating.rating;
    }, 0);

    return totalRating / ratings.length;
  };
}
