const axios = require("axios");

module.exports = function (addressString) {
	return new Promise((resolve, reject) => {
		let encodedAddressString = encodeURIComponent(addressString);
		// Using OpenMaps API
		getCoordinatesByAddressByOpenMapsAPI(encodedAddressString)
			.then(coordinates => {
				if (coordinates == null) {
					return getCoordinatesByAddressByBingMapsAPI(addressString);
				} else {
					resolve(coordinates);
				}
			})
			// Using BingMaps API
			.then(coordinates => {
				if (coordinates == null) {
					return new Error("Could not locate address");
				} else {
					resolve(coordinates);
				}
			}).catch(error => reject(error));
	});
}

function getCoordinatesByAddressByOpenMapsAPI(address) {
	return new Promise((resolve, reject) => {
		let url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&polygon=1&addressdetails=1`;
		axios.get(url)
			.then(response => { return response.data })
			.then(data => {
				if (data.length) {
					resolve({
						lat: data[0].lat,
						lon: data[0].lon
					});
				} else {
					resolve(null);
				}
			}).catch(error => reject(error));
	});
}

function getCoordinatesByAddressByBingMapsAPI(address) {
	return new Promise((resolve, reject) => {
		axios.get(`http://dev.virtualearth.net/REST/v1/Locations?query=${address}&key=${process.env.BING_MAPS_API_KEY}`)
			.then(response => {
				return response.data;
			})
			.then(data => {
				if (data.resourceSets[0].estimatedTotal) {
					resolve({
						lat: data.resourceSets[0].resources[0].point.coordinates[0],
						lon: data.resourceSets[0].resources[0].point.coordinates[1]
					});
				} else {
					resolve(null);
				}
			}).catch(error => {
				reject(error)
			});
	});
}