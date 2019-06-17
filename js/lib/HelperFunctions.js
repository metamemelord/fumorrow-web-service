const filename = require("path").basename(__filename);
const logger = require("../Loggers/index").LoggerFactory.getLogger(filename);

function generateSalt(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function checkDate(date) {
	var currentDate = new Date();
	var checkDate = new Date(date);
	return checkDate < currentDate;
}

function resolvePrivileges(privilegeBitMask) {
	var availablePrivileges = [];
	var grantedPrivileges = [];
	try {
		availablePrivileges = process.env.AVAILABLE_PRIVILEGES.split(",");
	} catch (error) {
		logger.error("Could not find available privileges in environment");
		return grantedPrivileges;
	}
	var i = 0;
	while (privilegeBitMask > 0 && i < availablePrivileges.length) {
		if (privilegeBitMask % 2) {
			grantedPrivileges.push(availablePrivileges[i]);
		}
		i++;
		privilegeBitMask = Math.floor(privilegeBitMask / 2);
	}
	return grantedPrivileges;
}

function isEmpty(variable) {
	if (typeof (variable) == "number" || typeof (variable) == "boolean") {
		return false;
	}
	if (typeof (variable) == "undefined" || variable === null) {
		return true;
	}
	if (typeof (variable.length) != "undefined") {
		return variable.length == 0;
	}
	var count = 0;
	for (var i in variable) {
		if (variable.hasOwnProperty(i)) {
			count++;
		}
	}
	return count == 0;
}

function isNotEmpty(variable) {
	return !isEmpty(variable);
}

function toTitleCase(string) {
	return string.split(" ")
		.map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
		.join(" ");
}

function isNumber(variable) {
	var _result = isNotEmpty(variable);
	try {
		_result &= !isNaN(parseInt(variable));
	} catch (error) {
		_result &= false;
	}
	return _result;
}

function isInteger(variable) {
	var _result = isNumber(variable);
	if (_result) {
		_result &= variable == Math.floor(variable);
	}
	return _result;
}

function isString(variable) {
	var _result = isNotEmpty(variable);
	if (_result) {
		_result &= variable.constructor === String;
	}
	return _result;
}

function retainSelectivePathParams(path, paramsToRetain) {
	let result = "";
	let pathElements = path.split("?");
	if(pathElements.length != 2) {
		result = path;
	} else {
		const baseUrl = pathElements[0];
		const pathParams = pathElements[1].split("&");
        const filteredParams = [];
		for(let pathParam of pathParams) {
			const pathParamKey = pathParam.split("=")[0];
			if(paramsToRetain.includes(pathParamKey.trim()))
				filteredParams.push(pathParam);
		}
		result = [baseUrl, filteredParams.join("&")].join("?");
	}
	return result;
}

module.exports = {
	generateSalt,
	checkDate,
	resolvePrivileges,
	isEmpty,
	isNotEmpty,
	toTitleCase,
	isNumber,
	isInteger,
	isString,
	retainSelectivePathParams
};