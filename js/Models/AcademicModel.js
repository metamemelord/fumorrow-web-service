var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GeolocationSchema = require("./GeolocationSchema");

var academicSchema = new mongoose.Schema({

	_id: {
		type: Schema.ObjectId,
		required: true
	},
	uid: {
		type: String,
		lowercase: true,
		required: true
	},
	title: {
		type: String,
		lowercase: true,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: "Offline"
	},
	addresses: {
		type: [String],
		required: true
	},
	multiple_locations: {
		type: Boolean,
		default: false
	},
	eligibilities: {
		type: Array,
		default: []
	},
	funding_status: {
		type: String,
		required: true
	},
	deadline: {
		type: Date,
		required: true
	},
	benefits: {
		type: Array,
		default: []
	},
	additional_info: {
		type: Array,
		default: []
	},
	images: {
		type: Array,
		default: []
	},
	videos: {
		type: Array,
		default: []
	},
	texts: {
		type: Array,
		default: []
	},
	partners: {
		type: Array,
		default: []
	},
	is_sponsored: {
		type: Boolean,
		default: false
	},
	recheck_needed: {
		type: Boolean,
		default: false
	},
	is_approved: {
		type: Boolean,
		default: false
	},
	user_visit_info: {
		type: Array,
		default: []
	},
	favorited_by: {
		type: Array,
		default: []
	},
	click_counter: {
		type: Number,
		default: 0
	},
	is_live: {
		type: Boolean,
		default: false
	},
	geometery: GeolocationSchema
})

module.exports = academicSchema;