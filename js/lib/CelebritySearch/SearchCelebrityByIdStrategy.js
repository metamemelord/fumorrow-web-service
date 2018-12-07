const DAL = require("../../DAL/index");
const celebritiesDAO = DAL.CelebritiesDAO;

module.exports.search = (parameter, callback) => {
	celebritiesDAO.searchCelebrityByPid(parameter, callback);
};
