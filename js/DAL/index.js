const MovieDAO = require('./Movies/MovieDAO');
const MovieDAOForRetrieval = require('./Movies/MovieDAOForRetrieval');
const BookDAO = require('./Books/BookDAO');
const BookDAOForRetrieval = require('./Books/BookDAOForRetrieval');

// Common routes

const LoginDAO = require('./Commons/LoginDAO');
const RegistrationDAO = require('./Commons/RegistrationDAO');
const CelebritiesDAO = require('./Commons/CelebritiesDAO');

module.exports = {
    MovieDAO: MovieDAO,
    MovieDAOForRetrieval: MovieDAOForRetrieval,
    BookDAO: BookDAO,
    BookDAOForRetrieval: BookDAOForRetrieval,
    LoginDAO: LoginDAO,
    RegistrationDAO: RegistrationDAO,
    CelebritiesDAO: CelebritiesDAO
}