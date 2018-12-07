const DAL = require("../../DAL/index");
const celebritiesDAO = DAL.CelebritiesDAO;
const isEmpty = require("../../Utils/HelperFunctions").isEmpty;

module.exports.search = (parameter, callback) => {
	if (isEmpty(parameter.trim())) {
		return callback(200, "Ok", []);
	}
	var nameTokens = parameter.trim().split(" ").filter(token => token !== "").map(token => token.trim().toLowerCase());
	if (isEmpty(nameTokens)) {
		return callback(200, "Ok", []);
	}
	else {
		celebritiesDAO.searchCelebrityByNameTokens(nameTokens, callback);
	}
};
