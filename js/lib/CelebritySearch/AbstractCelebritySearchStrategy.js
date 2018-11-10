const isInteger = require('../../Utils/HelperFunctions').isInteger;

function getSearchStrategy(parameter) {
    return (isInteger(parameter)) ? require('./SearchCelebrityByIdStrategy') : require('./SearchCelebrityByNameStrategy');
}

module.exports.getSearchStrategy = getSearchStrategy;