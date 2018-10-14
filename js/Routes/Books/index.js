const express = require('express');
const filename = require('path').basename(__filename);
const bookIndexRouter = express.Router();

// Getting routes

const returnBooks = require('./ReturnBooks');
const addBook = require('./AddBook');
const deleteBook = require('./DeleteBook');
const miscRoutes = require('./Misc');
const returnBookById = require('./ReturnBookById');
const returnAllUnchecked = require('./ReturnAllUncheckedBooks');
const returnAllRecheckNeeded = require('./');
const markForRecheckById = require('./MarkBookForRecheckById');
const approveById = require('./ApproveBookById');
const modifyBook = require('./ModifyBook');

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


// mainAPIRouter.post('/api/movie/test', function (req, res) {
//     try {
//         movieDAO.getAllUnapproved(function (data) {
//             res.status(200).json(data);
//         });

//     } catch (error) {
//         logger.error(error);
//         res.status(304).send("Unmodified");
//     }
// });


// ------- Methods below are only for demonstration. --------


// mainAPIRouter.post('/api/movie/modify', function (req, res) {
//     try {
//         movieDAO.getById(req.body.id, function (movie) {
//             if (movie) {
//                 res.status(200).json(movie);
//             } else {
//                 res.status(400).json({});
//             }
//         })

//     } catch (error) {
//         logger.error(error);
//         res.status(304).send("Unmodified");
//     }
// });


// mainAPIRouter.post('/api/movie/approve', function (req, res) {
//     try {
//         if (req.body.id !== undefined) {
//             movieDAO.approveById(req.body.id, function (status) {
//                 if (status === 200) {
//                     res.status(200).send("Increment successful");
//                 } else if (status === 412) {
//                     res.status(412).send("Invalid ID");
//                 } else if (status === 500) {
//         })

//     } catch (error) {
//         logger.error(error);
//         res.status(304).send("Unmodified");
//                     res.status(500).send("Internal error");
//                 } else {
//                     res.status(404).send("Content not found on the server");
//                 }
//             });
//         }
//         else {
//             res.status(400).send("Provide an ID before proceeding");
//         }
//     } catch (error) {
//         logger.error(error);
//         res.status(304).send("Unmodified");
//     }
// });

// mainAPIRouter.post('/api/movie/checker', function (req, res) {
//     try {
//         if (req.body.id !== undefined) {
//             movieDAO.markCheckedById(req.body.id, function (status) {
//                 if (status === 200) {
//                     res.status(200).send("Checked");
//                 } else if (status === 412) {
//                     res.status(412).send("Invalid ID");
//                 } else if (status === 500) {
//                     res.status(500).send("Internal error");
//                 } else {
//                     res.status(404).send("Content not found on the server");
//                 }
//             });
//         }
//         else {
//             res.status(400).send("Provide an ID before proceeding");
//         }
//     } catch (error) {
//         logger.error(error);
//         res.status(304).send("Unmodified");
//     }
// });


module.exports = bookIndexRouter;