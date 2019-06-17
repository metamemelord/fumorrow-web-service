const express = require("express");
const DAL = require("../../DAL/index");
const bookRequestVerifier = require("../Books/AddToBookRequestVerifier");
const bookDAO = DAL.BookDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const md5 = require("md5");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

const addBookRouter = express.Router();

addBookRouter.post(
	"/api/book/add",
	tokenVerifier,
	tokenAuthCheck,
	bookRequestVerifier,
	function (req, res) {
		try {
			jwt.verify(req.token, process.env.key, function (error, authData) {
				if (error) {
					if (error["name"] == "TokenExpiredError")
						return res.status(401).json({
							status: {
								code: 401,
								message: "Token expired"
							},
							data: null
						});
					logger.error("Attempt to login with invalid token");
					return res.status(400).json({
						status: {
							code: 400,
							message: "Invalid token"
						},
						data: null
					});
				} else {
					if (!authData["privileges"].includes("books")) {
						return res.status(403).json({
							status: {
								code: 403,
								message: "Insufficient privileges"
							},
							data: null
						});
					} else {
						var bookData = req.body;
						var bookObject = {
							_id:
								bookData.day.toString() +
								bookData.month.toString() +
								bookData.year.toString(),
							book_name: bookData.book_name,
							release_date: new Date(
								bookData.year,
								bookData.month - 1,
								bookData.day
							).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
							}),
							uid: "",
							publication_year: bookData.publication_year,
							edition: bookData.edition,
							pages: bookData.pages,
							weight: bookData.weight,
							author: bookData.author,
							ISBN: bookData.ISBN,
							price: bookData.price,
							language: bookData.language,
							binding: bookData.binding,
							publisher: bookData.publisher,
							genres: bookData.genres,
							similar_books: bookData.similar_books,
							images: bookData.images,
							videos: bookData.videos,
							texts: bookData.texts,
							partners: bookData.partners,
							is_sponsored: bookData.is_sponsored,
							is_released: false,
							is_live: bookData.is_live,
							external_ratings: bookData.external_ratings
						};
						var length = 12 - bookObject._id.length;
						bookObject._id += helpers.generateSalt(length);
						var uniqueId =
							bookObject.book_name +
							bookObject.release_date.toString() +
							bookData.referrerName;
						bookObject.uid = md5(uniqueId.replace(/\s/g, ""));
						if (helpers.isNotEmpty(bookObject.genres) && 
						    bookObject.genres.constructor === Array)
							bookObject.genres.sort();
						bookObject.is_released = helpers.checkDate(bookObject.release_date);
						bookDAO.addBook(bookObject, function (status, message, data) {
							return res.status(status).json({
								status: {
									code: status,
									message: message
								},
								data: data
							});
						});
					}
				}
			});
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				status: {
					code: 500,
					message: "Internal server error"
				},
				data: null
			});
		}
	}
);

module.exports = addBookRouter;
