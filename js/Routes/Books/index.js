const express = require("express");
const bookIndexRouter = express.Router();

// Getting routes

const returnBooks = require("./ReturnBooks");
const addBook = require("./AddBook");
const deleteBook = require("./DeleteBook");
const miscRoutes = require("./Misc");
const returnBookById = require("./ReturnBookById");
const returnAllUnchecked = require("./ReturnAllUncheckedBooks");
const returnAllRecheckNeeded = require("./ReturnAllBookRecheckNeeded");
const markForRecheckById = require("./MarkBookForRecheckById");
const approveById = require("./ApproveBookById");
const modifyBook = require("./ModifyBook");

// CRUD OPERATIONS

bookIndexRouter.use(returnBooks);
bookIndexRouter.use(addBook);
bookIndexRouter.use(deleteBook);
bookIndexRouter.use(modifyBook);
bookIndexRouter.use(miscRoutes);
bookIndexRouter.use(returnAllUnchecked);
bookIndexRouter.use(returnAllRecheckNeeded);
bookIndexRouter.use(approveById);
bookIndexRouter.use(markForRecheckById);
bookIndexRouter.use(returnBookById);

module.exports = bookIndexRouter;
