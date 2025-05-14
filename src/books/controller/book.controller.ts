import { Request, Response } from "express";
import { BookService } from "../service/book.service";
import { BookDocument } from "../model/book.model";
import { FilterQuery } from "mongoose";
import { BookModel } from "../model/book.model";

const bookService = new BookService();

export const createBook = async (req: Request, res: Response) => {
  console.log("Request body:", req.body);
  const { authorId, categoryId, ...bookData } = req.body;

  const newBook = await bookService.createBook(authorId, categoryId, bookData);

  res.status(201).json(newBook);
};

export const updateBook = async (req: Request, res: Response) => {
  console.log("request aye ha book ki")
  const { id: bookId } = req.params;
  const { ...updateData } = req.body;

  const updatedArt = await bookService.updateBookById(bookId, updateData);

  res.status(200).json(updatedArt);
};

// export const getBooks = async (req: Request, res: Response) => {
//   console.log("get book api is called");

//   const { page = 1, limit = 10, ...query } = req.query;
//   let id;
//   if (query.id) id = query._id;

//   const queryParams: FilterQuery<BookDocument> = {};

//   Object.keys(query).forEach((key) => {
//     queryParams[key] = query[key];
//   });

//   const arts = await bookService.getBooks({
//     page: parseInt(page as string),
//     limit: parseInt(limit as string),
//     query: queryParams,
//   });

//   console.log("Query Params ->", queryParams);
//   // console.log("Fetched Books ->", arts);
//   console.log("arts ->", arts);

//   res.status(200).json(arts);
// };

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    console.log("get book api is called");
    // Get total count for pagination
    const totalCount = await BookModel.countDocuments({ status: 'published' });
    const lastPage = Math.ceil(totalCount / parseInt(limit as string));

    // Get books with populated author and category
    const books = await BookModel.find({ status: 'published' })
      .populate('author', 'display_name')
      .populate('category', 'category_name')
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .lean();

    // Transform data to match frontend expectations
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
      publisher: 'Publisher Name', // Add this field if available in your model
      release_date: new Date(book.publishYear, 0, 1).toISOString(), // Convert year to date
      isbn: '1234567890', // Add if available
      edition: 'First Edition', // Add if available
      bookReviews: [] // Initialize empty reviews array
    }));

    // console.log("Transformed Books ->", transformedBooks);
    res.status(200).json({
      data: transformedBooks,
      lastPage,
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};
export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedArt = await bookService.deleteBookById(id);
  res.status(200).json(deletedArt);
};
