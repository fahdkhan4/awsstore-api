import { Request, Response } from "express";
import { BookService } from "../service/book.service";
import { BookDocument } from "../model/book.model";
import { FilterQuery } from "mongoose";

const bookService = new BookService();

export const createBook = async (req: Request, res: Response) => {
  const { authorId, categoryId, ...bookData } = req.body;

  const newBook = await bookService.createBook(authorId, categoryId, bookData);

  res.status(201).json(newBook);
};

export const updateBook = async (req: Request, res: Response) => {
  const { id: bookId } = req.params;
  const { ...updateData } = req.body;

  const updatedArt = await bookService.updateBookById(bookId, updateData);

  res.status(200).json(updatedArt);
};

export const getBooks = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, ...query } = req.query;
  let id;
  if (query.id) id = query._id;

  const queryParams: FilterQuery<BookDocument> = {};

  Object.keys(query).forEach((key) => {
    queryParams[key] = query[key];
  });

  const arts = await bookService.getBooks({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    query: queryParams,
  });

  res.status(200).json(arts);
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedArt = await bookService.deleteBookById(id);
  res.status(200).json(deletedArt);
};
