const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAO = DAL.WebSeriesDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const episodeRequestVerifier = require("./EpisodeRequestVerifier");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = helpers.isEmpty;

const addSeasonRouter = express.Router();

addSeasonRouter.post(
  "/api/web-series/season/add-episode",
  tokenVerifier,
  tokenAuthCheck,
  episodeRequestVerifier,
  function(req, res) {
    try {
      jwt.verify(req.token, process.env.key, function(error, authData) {
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
          if (!authData["privilages"].includes("web-series")) {
            return res.status(403).json({
              status: {
                code: 403,
                message: "Insufficient privilages"
              },
              data: null
            });
          } else {
            if (isEmpty(req.body.episode_number)) {
              return res.status(400).json({
                status: {
                  code: 400,
                  message: "Episode number cannot be blank"
                },
                data: null
              });
            }
            var seriesEpisodeData = req.body;
            if (isEmpty(seriesEpisodeData.hour)) seriesEpisodeData.hour = 0;
            if (isEmpty(seriesEpisodeData.minute)) seriesEpisodeData.minute = 0;
            var episodeObject = {
              title: seriesEpisodeData.title,
              date: seriesEpisodeData.date,
              runtime: seriesEpisodeData.runtime
			  ? seriesEpisodeData.runtime
			  : 0,
			  summary: seriesEpisodeData.summary,
              season_id: seriesEpisodeData.season_id,
              episode_number: seriesEpisodeData.episode_number,
              images: seriesEpisodeData.images,
              videos: seriesEpisodeData.videos,
              texts: seriesEpisodeData.texts,
              partners: seriesEpisodeData.partners,
              is_sponsored: seriesEpisodeData.is_sponsored,
              external_ratings: seriesEpisodeData.external_ratings
            };
            webSeriesDAO.addEpisode(episodeObject, function(
              status,
              message,
              data
            ) {
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

module.exports = addSeasonRouter;
