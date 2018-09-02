const MovieDAO = require('./Movies/MovieDAO');
const MovieDAOForRetrieval = require('./Movies/MovieDAOForRetrieval');

// Common routes

const LoginDAO = require('./Commons/LoginDAO');
const RegistrationDAO = require('./Commons/RegistrationDAO');
const CelebritiesDAO = require('./Commons/CelebritiesDAO');

module.exports = {
    MovieDAO: MovieDAO,
    MovieDAOForRetrieval: MovieDAOForRetrieval,
    LoginDAO: LoginDAO,
    RegistrationDAO: RegistrationDAO,
    CelebritiesDAO: CelebritiesDAO
}