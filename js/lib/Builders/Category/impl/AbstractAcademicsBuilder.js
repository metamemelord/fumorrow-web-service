module.exports.getAcademicEvent = function (subtype) {
    switch (subtype) {
        case "competition":
            return require("./AcademicEvents/Competition");
        case "conference":
            return require("./AcademicEvents/Conference");
        default:
            return undefined;
    }
};