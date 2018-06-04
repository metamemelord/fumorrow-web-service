const express = require('express');
const DAL = require('../../DAL/index');
const movieRequestVerifier = require('../Movies/DeleteMovieRequestVerifier');
const movieDAO = DAL.MovieDAO;
const deleteMovieRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");


deleteMovieRouter.post('/api/movie/delete', helpers.tokenVerifier, movieRequestVerifier.verify, function (req, res) {
    try{
        jwt.verify(req.token, process.env.key, function (err, authData) {
            if (err) {
                console.log("ERROR: ",err);
                return res.status(401).send("Invalid token");
            } else {
                if (!authData['privilages'].includes('movies')) {
                    return res.status(403).send("Insufficient privilages");
                } else {
                    try {
                        var id = req.body.id;
                        movieDAO.removeById(id, function (status) {
                            if (status === 200) {
                                return res.status(200).send(id + " deleted successfully!");
                            } else if (status === 404) {
                                return res.status(404).send("Invalid ID");
                            } else {
                                return res.status(500).send("Internal server error");
                            }
                        })
                    } catch (error) {
                        console.log("ERROR: ",error);
                        return res.sendStatus(304);
                    }
                }
            }
        })
    }
    catch(error){
        console.log("ERROR: ",error);
        return res.status(500).send("Internal server error")
    }
});

module.exports = deleteMovieRouter;
