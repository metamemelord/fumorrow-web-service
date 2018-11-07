const MovieDAO = require('./Movies/MovieDAO');
const MovieDAOForRetrieval = require('./Movies/MovieDAOForRetrieval');
const BookDAO = require('./Books/BookDAO');
const BookDAOForRetrieval = require('./Books/BookDAOForRetrieval');
const BikeDAO = require('./Bikes/BikeDAO');
const BikeDAOForRetrieval = require('./Bikes/BikeDAOForRetrieval');
const CarDAO = require('./Cars/CarDAO');
const CarDAOForRetrieval = require('./Cars/CarDAOForRetrieval');
const VideoGameDAO = require('./VideoGames/VideoGameDAO');
const VideoGameDAOForRetrieval = require('./VideoGames/VideoGameDAOForRetrieval');

// Common routes

const LoginDAO = require('./Commons/LoginDAO');
const RegistrationDAO = require('./Commons/RegistrationDAO');
const CelebritiesDAO = require('./Commons/CelebritiesDAO');

module.exports = {
    MovieDAO: MovieDAO,
    MovieDAOForRetrieval: MovieDAOForRetrieval,
    BookDAO: BookDAO,
    BookDAOForRetrieval: BookDAOForRetrieval,
    BikeDAO: BikeDAO,
    BikeDAOForRetrieval: BikeDAOForRetrieval,
    CarDAO: CarDAO,
    CarDAOForRetrieval: CarDAOForRetrieval,
    VideoGameDAO: VideoGameDAO,
    VideoGameDAOForRetrieval: VideoGameDAOForRetrieval,
    LoginDAO: LoginDAO,
    RegistrationDAO: RegistrationDAO,
    CelebritiesDAO: CelebritiesDAO
}