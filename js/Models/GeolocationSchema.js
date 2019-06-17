const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//create Geolocation Schema
module.exports = new Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number],
		index: "2dsphere"
	}
});