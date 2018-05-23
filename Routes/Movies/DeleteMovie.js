const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const deleteMovieRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");


deleteMovieRouter.post('/api/movie/delete', helpers.tokenVerifier, function (req, res) {

    jwt.verify(req.token, process.env.key, function (err, authData) {
        if (err) {
            console.log(err);
            return res.status(401).send("Invalid token");
        } else {
            if (!authData['privilages'].includes('movies')) {
                return res.status(403).send("Insufficient privilages");
            } else {
                try {
                    movieDAO.removeById(req.body.id, function (status) {
                        if (status === 200) {
                            res.status(200);
                            res.send(req.body.id + " deleted successfully!");
                        } else if (status === 404) {
                            res.status(404);
                            res.send("Invalid ID");
                        } else {
                            res.send(status + ": Error");
                        }
                    })
                } catch (error) {
                    console.log(error);
                    res.status(304).send("Not modified");
                }
            }
        }
    })
});

module.exports = deleteMovieRouter;