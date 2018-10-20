const express = require('express');
const DAL = require('../../DAL/index');
const bookIdVerifier = require('../RouteUtils').requestIdVerifier;
const bookRequestVerifier = require('../Books/AddToBookRequestVerifier');
const bookDAO = DAL.BookDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Utils/HelperFunctions");
const tokenVerifier = require('./../../Utils/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Utils/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Utils/HelperFunctions').isEmpty;

const modifyBookRouter = express.Router();

modifyBookRouter.post('/api/book/modify',
    tokenVerifier,
    tokenAuthCheck,
    bookIdVerifier,
    bookRequestVerifier,
    function (req, res) {
        try {
            jwt.verify(req.token, process.env.key, function (error, authData) {
                if (error) {
                    if (error['name'] == 'TokenExpiredError')
                        return res.status(401).json({
                            "status": {
                                "code": 401,
                                "message": "Token expired"
                            },
                            "data": null
                        });
                    logger.error("Attempt to login with invalid token");
                    return res.status(400).json({
                        "status": {
                            "code": 400,
                            "message": "Invalid token"
                        },
                        "data": null
                    });
                } else {
                    if (!authData['privilages'].includes('books')) {
                        return res.status(403).json({
                            "status": {
                                "code": 403,
                                "message": "Insufficient privilages"
                            },
                            "data": null
                        });
                    } else {
                        var bookData = req.body;
                        var bookObject = {
                            _id: bookData._id,
                            book_name: bookData.book_name,
                            release_date: new Date(bookData.year, bookData.month, bookData.day).toLocaleString('en-US', {
                                timeZone: 'Asia/Calcutta'
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
                            description: bookData.description,
                            image_provider: bookData.image_provider,
                            image_url: bookData.image_url,
                            ecom_image_url: bookData.ecom_image_url,
                            ecombook_url: bookData.ecombook_url,
                            referrer_name: bookData.referrer_name,
                            redirect_url: bookData.redirect_url,
                            is_sponsored: bookData.is_sponsored,
                            is_released: false,
                            is_live: bookData.is_live,
                            mpaa_rating: bookData.mpaa_rating,
                            trivia: bookData.trivia,
                            teasers: bookData.teasers,
                            related_videos: bookData.related_videos,
                            external_ratings: bookData.external_ratings,
                            is_partner_sponsored: false
                        }
                        var uniqueId = bookObject.book_name + bookObject.release_date.toString() + bookData.referrerName;
                        uniqueId = uniqueId.replace(/\s/g, '');
                        bookObject.uid = md5(uniqueId);
                        bookObject.genres.sort();
                        bookObject.is_released = helpers.checkDate(bookObject.release_date);
                        bookDAO.modifyBook(bookObject, function (status, message, data) {
                            return res.status(status).json({
                                "status": {
                                    "code": status,
                                    "message": message
                                },
                                "data": data
                            });
                        });
                    }
                }
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                "status": {
                    "code": 500,
                    "message": "Internal server error"
                },
                "data": null
            });
        }
    });

module.exports = modifyBookRouter;