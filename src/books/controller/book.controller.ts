import { Request, Response } from "express";
import { BookService } from "../service/book.service";
import {
  uploadToFirebase,
  updateFirebaseFile,
  deleteFirebaseFile,
} from "../../documents/service/document.service";

const bookService = new BookService();

export const createBook = async (req: Request & any, res: Response) => {
  const { authorId, genreId, title, ...bookData } = req.body;
  const bookSourceFile = req.files["bookSource"]
    ? req.files["bookSource"][0]
    : null;
  const bookCoverImage = req.files["bookImageCover"]
    ? req.files["bookImageCover"][0]
    : null;

  if (!bookSourceFile || !bookCoverImage)
    return res.status(400).send("Book source file or cover image is missing.");

  const bookFileUrl = await uploadToFirebase(
    req.firebaseStorage,
    bookSourceFile,
    "books",
    authorId,
    title
  );
  const bookImageCoverUrl = await uploadToFirebase(
    req.firebaseStorage,
    bookCoverImage,
    "covers",
    authorId,
    title
  );

  const newBook = await bookService.createBook(authorId, genreId, {
    ...bookData,
    title: title,
    bookFile: bookFileUrl,
    bookImageCover: bookImageCoverUrl,
  });

  res.status(201).json(newBook);
};

export const getPaginatedBooks = async (req: Request, res: Response) => {
  const {
    pageNumber,
    size,
    status,
    lastObjectId,
    author,
    price,
    title,
    genre,
    pagesCount,
    language,
    publishYear,
    isPublic,
    isPublished,
    isDeleted,
  } = req.query;

  const books = await bookService.getPaginatedBooksFromDB(
    parseInt(pageNumber as string) || 1,
    parseInt(size as string) || 50,
    status as string,
    lastObjectId as string,
    title as string,
    author as string,
    genre as string,
    price ? JSON.parse(price as string) : undefined,
    pagesCount as string,
    language as string,
    publishYear as string,
    isPublic === "true",
    isPublished === "true",
    isDeleted === "true"
  );

  res.status(200).json(books);
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await bookService.getBookById(id);
  res.status(200).json(book);
};

export const updateBookById = async (req: Request & any, res: Response) => {
  const { id: bookId } = req.params;
  const { ...updateData } = req.body;

  const currentBook = await bookService.getBookById(bookId);
  if (!currentBook) return res.status(404).json({ message: "Book not found" });

  const authorId = currentBook.author._id.toString();
  const title = currentBook.title.toString();

  const bookSourceFile = req.files["bookSource"]
    ? req.files["bookSource"][0]
    : null;
  const bookCoverImage = req.files["bookImageCover"]
    ? req.files["bookImageCover"][0]
    : null;

  if (bookSourceFile) {
    const bookFileUrl = await updateFirebaseFile(
      req.firebaseStorage,
      bookSourceFile,
      "books",
      authorId,
      title
    );
    updateData.bookFile = bookFileUrl;
  }

  if (bookCoverImage) {
    const bookImageCoverUrl = await updateFirebaseFile(
      req.firebaseStorage,
      bookCoverImage,
      "covers",
      authorId,
      title
    );
    updateData.bookImageCover = bookImageCoverUrl;
  }

  const updatedBook = await bookService.updateBookById(bookId, updateData);
  res.status(200).json(updatedBook);
};

export const deleteBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedBook = await bookService.deleteBookById(id);
  res.status(200).json(deletedBook);
};

export const reviewBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId, isAdminApproved } = req.body;
  const result = await bookService.reviewBookById(bookId, isAdminApproved);

  // You can customize the response based on your needs
  res.status(200).json({
    success: true,
    message: "Book review completed successfully.",
    result: result, // Include additional details if needed
  });
};
