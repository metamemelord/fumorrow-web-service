const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const deleteMovieRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");


deleteMovieRouter.post('/api/movie/delete', helpers.tokenVerifier, function (req, res) {
    try{
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
                                res.status(200).send(req.body.id + " deleted successfully!");
                            } else if (status === 404) {
                                res.status(404).send("Invalid ID");
                            } else {
                                res.status(500).send("Internal server error");
                            }
                        })
                    } catch (error) {
                        console.log(error);
                        res.status(304).send("Not modified");
                    }
                }
            }
        })
    }
    catch(error){
        console.log("ERROR: ",error);
        res.status(500).send("Internal server error")
    }
});

module.exports = deleteMovieRouter;