import { Router } from "express";
import { addBook, deleteBook, getAllBooks, getBook, updateBook } from "../controller/book.controller";

const bookRouter: Router = Router();

bookRouter.get("/:id", getBook);
bookRouter.get("/", getAllBooks);
bookRouter.post("/add", addBook);
bookRouter.patch("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;