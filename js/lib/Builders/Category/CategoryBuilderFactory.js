module.exports.getBuilder = function (type, subtype) {
	switch (type) {
	case "movie":
		return require("./impl/Movie");
	case "academics":
		return require("./impl/AbstractAcademicsBuilder").getAcademicEvent(subtype);
	default:
		return undefined;
	}
};