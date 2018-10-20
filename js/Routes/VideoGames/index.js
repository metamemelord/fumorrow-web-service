const express = require('express');
const filename = require('path').basename(__filename);
const videoGameIndexRouter = express.Router();

// Getting routes

const returnVideoGames = require('./ReturnVideoGames');
const addVideoGame = require('./AddVideoGame');
const deleteVideoGame = require('./DeleteVideoGame');
const modifyVideoGame = require('./ModifyVideoGame');
const miscRoutes = require('./Misc');
const returnAllUnchecked = require('./ReturnAllUncheckedVideoGames');
const returnAllRecheckNeeded = require('./ReturnAllVideoGamesRecheckNeeded');
const approveById = require('./ApproveVideoGameById');
const markForRecheckById = require('./MarkVideoGameForRecheckById');
const returnVideoGameById = require('./ReturnVideoGameById');

// CRUD OPERATIONS

videoGameIndexRouter.use(returnVideoGames);
videoGameIndexRouter.use(addVideoGame);
videoGameIndexRouter.use(deleteVideoGame);
videoGameIndexRouter.use(modifyVideoGame);
videoGameIndexRouter.use(miscRoutes);
videoGameIndexRouter.use(returnAllUnchecked);
videoGameIndexRouter.use(returnAllRecheckNeeded);
videoGameIndexRouter.use(approveById);
videoGameIndexRouter.use(markForRecheckById);
videoGameIndexRouter.use(returnVideoGameById);

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


module.exports = videoGameIndexRouter;