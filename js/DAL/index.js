const MovieDAO = require("./Movies/MovieDAO");
const MovieDAOForRetrieval = require("./Movies/MovieDAOForRetrieval");
const BookDAO = require("./Books/BookDAO");
const BookDAOForRetrieval = require("./Books/BookDAOForRetrieval");
const BikeDAO = require("./Bikes/BikeDAO");
const BikeDAOForRetrieval = require("./Bikes/BikeDAOForRetrieval");
const CarDAO = require("./Cars/CarDAO");
const CarDAOForRetrieval = require("./Cars/CarDAOForRetrieval");
const VideoGameDAO = require("./VideoGames/VideoGameDAO");
const VideoGameDAOForRetrieval = require("./VideoGames/VideoGameDAOForRetrieval");
const WebSeriesDAO = require("./WebSeries/WebSeriesDAO");
const WebSeriesDAOForRetrieval = require("./WebSeries/WebSeriesDAOForRetrieval");
const AnimeDAO = require("./Anime/AnimeDAO");
const AnimeDAOForRetrieval = require("./Anime/AnimeDAOForRetrieval");

// Common routes

const LoginDAO = require("./Commons/LoginDAO");
const RegistrationDAO = require("./Commons/RegistrationDAO");
const CelebritiesDAO = require("./Commons/CelebritiesDAO");
const TokenVerification = require("./Commons/TokenVerification");
const MediaDAO = require("./Commons/media");

module.exports = {
	MovieDAO,
	MovieDAOForRetrieval,
	BookDAO,
	BookDAOForRetrieval,
	BikeDAO,
	BikeDAOForRetrieval,
	CarDAO,
	CarDAOForRetrieval,
	VideoGameDAO,
	VideoGameDAOForRetrieval,
	WebSeriesDAO,
	WebSeriesDAOForRetrieval,
	AnimeDAO,
	AnimeDAOForRetrieval,
	LoginDAO,
	RegistrationDAO,
	CelebritiesDAO,
	TokenVerification,
	MediaDAO
};
