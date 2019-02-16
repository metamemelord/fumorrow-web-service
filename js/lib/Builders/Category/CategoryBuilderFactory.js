module.exports.getBuilder = function (type, subtype) {
	switch (type) {
	case "movie":
		return require("./impl/Movie");
	case "academics":
		return require("./impl/Academics");
	default:
		return undefined;
	}
};