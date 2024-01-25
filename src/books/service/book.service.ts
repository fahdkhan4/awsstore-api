import mongoose, { Query } from "mongoose";
import { BookDocument, BookModel } from "../model/book.model";
import { AuthModel } from "../../auth/model/auth.model";
import { CategoryModel } from "../../categories/model/category.model";

const PAGE_SIZE = 50;

// todo: Set Admin Restrictions on  services (isPublished, status)

export class BookService {
  getBookPaginationQuery = ({
    query,
    pageNumber = 1,
    size = PAGE_SIZE,
    lastObjectId,
  }: {
    query: Query<BookDocument[], BookDocument>;
    pageNumber?: number;
    size?: number;
    lastObjectId?: string;
  }) => {
    const resultSize = size && size <= 50 ? size : PAGE_SIZE;

    if (!lastObjectId && pageNumber) query.skip(resultSize * (pageNumber - 1));

    if (lastObjectId)
      query.gt("_id", new mongoose.Types.ObjectId(lastObjectId));

    return query.limit(resultSize);
  };

  // Create a new book
  createBook = async (
    authorId: string,
    genreId: string,
    bookData: Partial<BookDocument>
  ): Promise<BookDocument> => {
    if (
      !mongoose.Types.ObjectId.isValid(authorId) ||
      !mongoose.Types.ObjectId.isValid(genreId)
    )
      throw new Error("Invalid authorId or genreId");

    // Check if the corresponding documents (author and genre) exist
    const [author, genre] = await Promise.all([
      AuthModel.findById(authorId),
      CategoryModel.findById(genreId),
    ]);

    if (!author || !genre) throw new Error("Author or genre not found");

    const bookWithReferences = {
      ...bookData,
      author: author._id,
      genre: genre._id,
      status: "review",
    };

    const book = await BookModel.create(bookWithReferences);
    return book;
  };

  // Get all books with pagination
  getPaginatedBooksFromDB = async (
    pageNumber: number = 1,
    size: number = PAGE_SIZE,
    status: string,
    lastObjectId?: string,
    title?: string,
    author?: string,
    genre?: string,
    price?: { min?: number; max?: number },
    pagesCount?: string,
    language?: string,
    publishYear?: string,
    isPublic?: boolean,
    isPublished?: boolean,
    isDeleted?: boolean,
    review?: string
  ): Promise<BookDocument[]> => {
    let queryFilter: Record<string, string | any> = { status };

    // Additional filters
    if (title) queryFilter = { ...queryFilter, title: new RegExp(title, "i") };

    if (author) queryFilter = { ...queryFilter, author: author };
    if (genre) queryFilter = { ...queryFilter, genre: genre };

    if (price?.max || price?.min) {
      let priceQuery = {};
      if (price.min) {
        priceQuery = { ...priceQuery, $gte: price.min };
      }

      // max price cannot be lower than min price
      if (!price.min || (price.max && price?.max >= price.min)) {
        priceQuery = { ...priceQuery, $lte: price.max };
      }

      queryFilter = {
        ...queryFilter,
        "bookPrice.amount": priceQuery,
      };
    }

    if (pagesCount !== undefined) queryFilter = { ...queryFilter, pagesCount };

    if (language !== undefined) queryFilter = { ...queryFilter, language };

    if (publishYear !== undefined)
      queryFilter = { ...queryFilter, publishYear };

    if (isPublic !== undefined) queryFilter = { ...queryFilter, isPublic };

    if (isPublished !== undefined)
      queryFilter = { ...queryFilter, isPublished };

    if (isDeleted !== undefined) queryFilter = { ...queryFilter, isDeleted };

    if (review !== undefined) queryFilter = { ...queryFilter, review };

    let query = BookModel.find(queryFilter);

    const queryWithPagination = this.getBookPaginationQuery({
      query,
      pageNumber,
      size,
      lastObjectId,
    });

    const books = await queryWithPagination
      .populate({
        path: "author",
        select: "-password -updatedAt",
      })
      .populate({
        path: "genre",
        select: "-updatedAt",
      })
      .exec();
    return books;
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
    authorId: string,
    genreId: string,
    updateData: Partial<BookDocument>
  ): Promise<BookDocument | null> => {
    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(authorId) ||
      !mongoose.Types.ObjectId.isValid(genreId)
    )
      throw new Error("Invalid bookId, authorId, or genreId");

    // Check if the corresponding documents (author and genre) exist
    const [author, genre] = await Promise.all([
      AuthModel.findById(authorId),
      CategoryModel.findById(genreId),
    ]);

    if (!author || !genre) throw new Error("Author or genre not found");

    // Assign the author and genre to the updateData
    const updateDataWithReferences = {
      ...updateData,
      author: author._id,
      genre: genre._id,
    };

    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      updateDataWithReferences,
      { new: true }
    ).populate("author genre");

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

    console.log("isAdminApproved ", isAdminApproved);

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
