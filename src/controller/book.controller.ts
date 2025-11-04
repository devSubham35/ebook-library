
import { prisma } from "../app";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { BOOK_CATEGORY } from "../generated/prisma/enums";

///////////////////////////////////////
/// Get All Books
///////////////////////////////////////

export const getAllBooks = asyncHandler(async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const includeDeletedItems = String(req.query.includeDeletedItems).toLowerCase() === "true";

  /// Calculate how many items to skip
  const skip = (page - 1) * limit;


  /// Fetch paginated books
  const books = await prisma.book.findMany({
    skip,
    take: limit,
    where: includeDeletedItems ? {} : { isDeleted: false },
    omit: {
      userId: true,
      isDeleted: true,
    }
  });

  /// Get total count of books
  const totalItems = await prisma.book.count();
  const totalPages = Math.ceil(totalItems / limit);

  const resData = {
    books,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      pageLimit: limit,
    },
  }

  return res.status(200).json(new ApiResponse(200, resData));

});



///////////////////////////////////////
/// Get Book by ID
///////////////////////////////////////

export const getBook = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params

  if (!id) {
    throw new ApiError(400, "Book id required!")
  }

  /// Find book by id
  const book = await prisma.book.findUnique({
    where: { id },
    omit: {
      userId: true,
      isDeleted: true,
    }
  });

  return res.status(200).json(new ApiResponse(200, book, "Fetched successfully"));

});



///////////////////////////////////////
/// Add New Book
///////////////////////////////////////

export const addBook = asyncHandler(async (req: Request, res: Response) => {

  const { name, author, category } = req.body;

  if (!name || !author || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isValidCategory = (category: string): category is BOOK_CATEGORY => {
    return Object.values(BOOK_CATEGORY).includes(category as BOOK_CATEGORY);
  };

  if (!isValidCategory(category)) {
    throw new ApiError(400, "Invalid category type!")
  }


  /// Check if user already exists
  const existingBook = await prisma.book.findUnique({
    where: { name },
  });

  if (existingBook) {
    throw new ApiError(400, "Book already exist!")
  }

  /// Create New book
  const newBook = await prisma.book.create({
    data: {
      name,
      author,
      category
    }
  })


  return res.status(200).json(new ApiResponse(200, newBook, "New book added successfully"));

});


///////////////////////////////////////
/// Update Book
///////////////////////////////////////

export const updateBook = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params;
  const { name, author, category } = req.body;

  if (!id) {
    throw new ApiError(400, "Book id required!")
  }

  /// Find existing book by ID
  const existingBook = await prisma.book.findUnique({
    where: { id },
    omit: {
      userId: true,
      isDeleted: true
    }
  });

  if (!existingBook) {
    throw new ApiError(400, "Book not found!")
  }

  /// Prepare update data dynamically (only include provided fields)
  const updateData: {
    name?: string;
    author?: string;
    category?: BOOK_CATEGORY;
  } = {};

  if (name) updateData.name = name;
  if (author) updateData.author = author;

  if (category) {
    const isValidCategory = Object.values(BOOK_CATEGORY).includes(category);
    if (!isValidCategory) {
      throw new ApiError(400, "Invalid category type!")
    }
    updateData.category = category;
  }

  // Perform update only if there’s something to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields to update!")
  }

  const updatedBook = await prisma.book.update({
    where: { id },
    data: updateData,
  });

  return res.status(200).json(new ApiResponse(200, updatedBook, "Book updated successfully"));

});


///////////////////////////////////////
/// Delete Book by ID
///////////////////////////////////////

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: "Book id required!" });
  }

  /// Find book by id
  const book = await prisma.book.findUnique({
    where: { id, isDeleted: false }
  });

  if (!book?.id) {
    throw new ApiError(400, "Book not found")
  }

  const deletedBook = await prisma.book.update({
    where: { id },
    data: {
      isDeleted: true
    },
    omit: {
      isDeleted: true
    }
  });

  return res.status(200).json(new ApiResponse(200, deletedBook, "Deleted successfully"));

});