"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.addBook = exports.getBook = exports.getAllBooks = void 0;
const app_1 = require("../app");
const enums_1 = require("../generated/prisma/enums");
///////////////////////////////////////
/// Get All Books
///////////////////////////////////////
const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const includeDeletedItems = String(req.query.includeDeletedItems).toLowerCase() === "true";
        /// Calculate how many items to skip
        const skip = (page - 1) * limit;
        /// Fetch paginated books
        const books = await app_1.prisma.book.findMany({
            skip,
            take: limit,
            where: includeDeletedItems ? {} : { isDeleted: false },
            omit: {
                userId: true,
                isDeleted: true,
            }
        });
        /// Get total count of books
        const totalItems = await app_1.prisma.book.count();
        const totalPages = Math.ceil(totalItems / limit);
        res.status(200).json({
            message: "Fetched successfully",
            data: {
                books,
                meta: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    pageLimit: limit,
                },
            },
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllBooks = getAllBooks;
///////////////////////////////////////
/// Get Book by ID
///////////////////////////////////////
const getBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book id required!" });
        }
        /// Find book by id
        const book = await app_1.prisma.book.findUnique({
            where: { id },
            omit: {
                userId: true,
                isDeleted: true,
            }
        });
        res.status(200).json({
            message: "Fetched successfully",
            data: book
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getBook = getBook;
///////////////////////////////////////
/// Add New Book
///////////////////////////////////////
const addBook = async (req, res) => {
    try {
        const { name, author, category } = req.body;
        if (!name || !author || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const isValidCategory = (category) => {
            return Object.values(enums_1.BOOK_CATEGORY).includes(category);
        };
        if (!isValidCategory(category)) {
            return res.status(400).json({ message: "Invalid category type!" });
        }
        /// Check if user already exists
        const existingBook = await app_1.prisma.book.findUnique({
            where: { name },
        });
        if (existingBook) {
            return res.status(400).json({ message: "Book already exist!" });
        }
        /// Create New book
        const newBook = await app_1.prisma.book.create({
            data: {
                name,
                author,
                category
            }
        });
        res.status(200).json({
            message: "New book added successfully",
            data: {
                ...newBook
            }
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addBook = addBook;
///////////////////////////////////////
/// Update Book
///////////////////////////////////////
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, author, category } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Book id is required!" });
        }
        /// Find existing book by ID
        const existingBook = await app_1.prisma.book.findUnique({
            where: { id },
        });
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found!" });
        }
        /// Prepare update data dynamically (only include provided fields)
        const updateData = {};
        if (name)
            updateData.name = name;
        if (author)
            updateData.author = author;
        if (category) {
            const isValidCategory = Object.values(enums_1.BOOK_CATEGORY).includes(category);
            if (!isValidCategory) {
                return res.status(400).json({ message: "Invalid category type!" });
            }
            updateData.category = category;
        }
        // Perform update only if there’s something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update!" });
        }
        const updatedBook = await app_1.prisma.book.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateBook = updateBook;
///////////////////////////////////////
/// Delete Book by ID
///////////////////////////////////////
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book id required!" });
        }
        /// Find book by id
        const book = await app_1.prisma.book.findUnique({
            where: { id }
        });
        if (!book?.id) {
            return res.status(400).json({ message: "Book not found, please try another" });
        }
        const updatedBook = await app_1.prisma.book.update({
            where: { id },
            data: {
                isDeleted: true
            }
        });
        res.status(200).json({
            message: "Deleted successfully",
            data: updatedBook
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteBook = deleteBook;
