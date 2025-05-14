// import mongoose, { FilterQuery } from "mongoose";
// import { BookDocument, BookModel } from "../model/book.model";
// import { AuthModel } from "../../auth/model/auth.model";
// import { CategoryModel } from "../../categories/model/category.model";
// import { sendBookCreationState } from "../../emails/books/sendBookCreationState.email";

// interface BookQueryParams {
//   page: number;
//   limit: number;
//   query: FilterQuery<BookDocument>;
// }

// export class BookService {
//   getBooks = async ({
//     page,
//     limit,
//     query,
//   }: BookQueryParams): Promise<BookDocument[]> => {
//     const book = await BookModel.find(query)
//       .skip((page - 1) * limit)
//       .exec();

//     return book;
//   };

//   // Create a new book
//   createBook = async (
//     authorId: string,
//     categoryId: string,
//     bookData: Partial<BookDocument>
//   ): Promise<BookDocument> => {
//     if (
//       !mongoose.Types.ObjectId.isValid(authorId) ||
//       !mongoose.Types.ObjectId.isValid(categoryId)
//     )
//       throw new Error("Invalid authorId or categoryId");

//     // Check if the corresponding documents (author and genre) exist
//     const [author, category] = await Promise.all([
//       AuthModel.findById(authorId),
//       CategoryModel.findById(categoryId),
//     ]);

//     if (!author || !category) throw new Error("Author or category not found");

//     if (author.accountType === "user")
//       throw new Error("Invalid authorId, only authors can create book");

//     const bookWithReferences = {
//       ...bookData,
//       author: author._id,
//       category: category._id,
//       status: "published",
//     };

//     const book = await BookModel.create(bookWithReferences);

//     sendBookCreationState({
//       email: author.email as string,
//       bookTitle: book.title as string,
//       state: book.status as string,
//     });

//     return book;
//   };

//   // Get a book by ID
//   getBookById = async (bookId: string): Promise<BookDocument | null> => {
//     const book = await BookModel.findById(bookId)
//       .populate({
//         path: "author",
//         select: "-password -updatedAt",
//       })
//       .populate({
//         path: "genre",
//         select: "-updatedAt",
//       })
//       .exec();
//     return book;
//   };

//   // Update a book by ID
//   updateBookById = async (
//     bookId: string,
//     updateData: Partial<BookDocument>
//   ): Promise<BookDocument | null> => {
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error("Invalid bookId, ");

//     const updateDataWithReferences = {
//       ...updateData,
//     };

//     const updatedBook = await BookModel.findByIdAndUpdate(
//       bookId,
//       updateDataWithReferences,
//       { new: true }
//     ).populate("author category");

//     return updatedBook;
//   };

//   // Delete a book by ID
//   deleteBookById = async (bookId: string): Promise<boolean> => {
//     const result = await BookModel.findByIdAndDelete(bookId);
//     return !!result;
//   };

//   //Admin Functions
//   //Review a book by ID
//   reviewBookById = async (
//     bookId: string,
//     isAdminApproved: boolean
//   ): Promise<boolean> => {
//     const book = await this.getBookById(bookId);

//     if (!book) throw new Error("Book not found");

//     if (!(book.status === "review" || book.status === "rejected"))
//       throw new Error(
//         "Cannot review a book that is not in review or rejected status"
//       );

//     const newStatus = isAdminApproved ? "published" : "rejected";

//     const updateDataWithReferences = {
//       status: newStatus,
//     };

//     await BookModel.findByIdAndUpdate(bookId, updateDataWithReferences, {
//       new: true,
//     });

//     return true;
//   };
// }
import mongoose, { FilterQuery } from "mongoose";
import { BookDocument, BookModel } from "../model/book.model";
import { AuthModel } from "../../auth/model/auth.model";
import { CategoryModel } from "../../categories/model/category.model";
import { sendBookCreationState } from "../../emails/books/sendBookCreationState.email";

interface BookQueryParams {
  page: number;
  limit: number;
  query?: FilterQuery<BookDocument>;
}

interface PaginatedBooksResult {
  data: any[];
  lastPage: number;
  currentPage: number;
  total: number;
}

export class BookService {
  // Get paginated books with transformed data for frontend
  getBooks = async ({
    page = 1,
    limit = 10,
    query = { status: 'published' }
  }: BookQueryParams): Promise<PaginatedBooksResult> => {
    const totalCount = await BookModel.countDocuments(query);
    const lastPage = Math.ceil(totalCount / limit);

    const books = await BookModel.find(query)
      .populate('author', 'display_name')
      .populate('category', 'category_name')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const transformedBooks = books.map(book => ({
      featured_image_url: book.bookImageCoverUrl,
      title_of_book: book.title,
      display_name: (book.author as any)?.display_name || 'Unknown Author',
      description: book.description,
      sale_price: book.bookAmount.price,
      bookCategory: [{
        category_name: (book.category as any)?.category_name || 'Uncategorized',
        category_id: book.category?._id.toString()
      }],
      book_id: book._id.toString(),
      author_id: book.author?._id.toString(),
      book_page_count: book.pagesCount,
      language: book.language,
      publisher: book.publisher || 'Unknown Publisher',
      release_date: book.publishYear 
        ? new Date(book.publishYear, 0, 1).toISOString() 
        : null,
      isbn: book.isbn || '',
      edition: book.edition || 'First Edition',
      bookReviews: [] // Initialize empty reviews array
    }));

    return {
      data: transformedBooks,
      lastPage,
      currentPage: page,
      total: totalCount
    };
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
    ) {
      throw new Error("Invalid authorId or categoryId");
    }

    const [author, category] = await Promise.all([
      AuthModel.findById(authorId),
      CategoryModel.findById(categoryId),
    ]);

    if (!author || !category) {
      throw new Error("Author or category not found");
    }

    if (author.accountType === "user") {
      throw new Error("Invalid authorId, only authors can create books");
    }

    const bookWithReferences = {
      ...bookData,
      author: author._id,
      category: category._id,
      status: "published",
    };

    const book = await BookModel.create(bookWithReferences);

    await sendBookCreationState({
      email: author.email as string,
      bookTitle: book.title as string,
      state: book.status as string,
    });

    return book;
  };

  // Get a single book by ID with populated fields
  getBookById = async (bookId: string): Promise<BookDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid bookId");
    }

    return await BookModel.findById(bookId)
      .populate({
        path: "author",
        select: "-password -updatedAt",
      })
      .populate({
        path: "category",
        select: "-updatedAt",
      })
      .exec();
  };

  // Update a book by ID
  updateBookById = async (
    bookId: string,
    updateData: Partial<BookDocument>
  ): Promise<BookDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid bookId");
    }

    return await BookModel.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    ).populate("author category");
  };

  // Delete a book by ID
  deleteBookById = async (bookId: string): Promise<boolean> => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid bookId");
    }

    const result = await BookModel.findByIdAndDelete(bookId);
    return !!result;
  };

  // Admin function to review a book
  reviewBookById = async (
    bookId: string,
    isAdminApproved: boolean
  ): Promise<BookDocument> => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid bookId");
    }

    const book = await BookModel.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (!['review', 'rejected'].includes(book.status)) {
      throw new Error(
        "Cannot review a book that is not in review or rejected status"
      );
    }

    const newStatus = isAdminApproved ? "published" : "rejected";
    book.status = newStatus;

    const updatedBook = await book.save();

    // Notify author about the status change
    const author = await AuthModel.findById(book.author);
    if (author) {
      await sendBookCreationState({
        email: author.email as string,
        bookTitle: book.title as string,
        state: newStatus,
      });
    }

    return updatedBook;
  };
}