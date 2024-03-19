import mongoose, { FilterQuery } from "mongoose";
import { BookDocument, BookModel } from "../model/book.model";
import { AuthModel } from "../../auth/model/auth.model";
import { CategoryModel } from "../../categories/model/category.model";
import { sendBookCreationState } from "../../emails/books/sendBookCreationState.email";

interface BookQueryParams {
  page: number;
  limit: number;
  query: FilterQuery<BookDocument>;
}

export class BookService {
  getBooks = async ({
    page,
    limit,
    query,
  }: BookQueryParams): Promise<BookDocument[]> => {
    const book = await BookModel.find(query)
      .skip((page - 1) * limit)
      .exec();

    return book;
  };

  // Create a new book
  createBook = async (
    authorId: string,
    categoryId: string,
    bookData: Partial<BookDocument>
  ): Promise<BookDocument> => {
    if (
      !mongoose.Types.ObjectId.isValid(authorId) ||
      !mongoose.Types.ObjectId.isValid(categoryId)
    )
      throw new Error("Invalid authorId or categoryId");

    // Check if the corresponding documents (author and genre) exist
    const [author, category] = await Promise.all([
      AuthModel.findById(authorId),
      CategoryModel.findById(categoryId),
    ]);

    if (!author || !category) throw new Error("Author or category not found");

    if (author.accountType === "user")
      throw new Error("Invalid authorId, only authors can create book");

    const bookWithReferences = {
      ...bookData,
      author: author._id,
      category: category._id,
      status: "published",
    };

    const book = await BookModel.create(bookWithReferences);

    sendBookCreationState({
      email: author.email as string,
      bookTitle: book.title as string,
      state: book.status as string,
    });

    return book;
  };

  // Get a book by ID
  getBookById = async (bookId: string): Promise<BookDocument | null> => {
    const book = await BookModel.findById(bookId)
      .populate({
        path: "author",
        select: "-password -updatedAt",
      })
      .populate({
        path: "genre",
        select: "-updatedAt",
      })
      .exec();
    return book;
  };

  // Update a book by ID
  updateBookById = async (
    bookId: string,
    updateData: Partial<BookDocument>
  ): Promise<BookDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error("Invalid bookId, ");

    const updateDataWithReferences = {
      ...updateData,
    };

    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      updateDataWithReferences,
      { new: true }
    ).populate("author category");

    return updatedBook;
  };

  // Delete a book by ID
  deleteBookById = async (bookId: string): Promise<boolean> => {
    const result = await BookModel.findByIdAndDelete(bookId);
    return !!result;
  };

  //Admin Functions
  //Review a book by ID
  reviewBookById = async (
    bookId: string,
    isAdminApproved: boolean
  ): Promise<boolean> => {
    const book = await this.getBookById(bookId);

    if (!book) throw new Error("Book not found");

    if (!(book.status === "review" || book.status === "rejected"))
      throw new Error(
        "Cannot review a book that is not in review or rejected status"
      );

    const newStatus = isAdminApproved ? "published" : "rejected";

    const updateDataWithReferences = {
      status: newStatus,
    };

    await BookModel.findByIdAndUpdate(bookId, updateDataWithReferences, {
      new: true,
    });

    return true;
  };
}
