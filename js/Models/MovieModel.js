var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var movieSchema = new mongoose.Schema({
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
	release_date: {
		type: Date,
		required: true
	},
	is_release_date_tentative: {
		type: Boolean,
		default: false
	},
	cast: {
		type: Array,
		required: true
	},
	crew: {
		type: Array,
		required: true
	},
	genres: {
		type: Array,
		required: true
	},
	runtime: {
		type: Number,
		default: 0
	},
	language: {
		type: Number,
		required: true
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
	showing_at: {
		type: Array,
		default: []
	},
	is_sponsored: {
		type: Boolean,
		default: false
	},
	is_released: {
		type: Boolean,
		default: false
	},
	is_live: {
		type: Boolean,
		default: false
	},
	click_counter: {
		type: Number,
		default: 0
	},
	mpaa_rating: {
		type: String,
		default: "U"
	},
	budget: {
		type: Number,
		default: 0
	},
	external_ratings: {
		type: Array,
		default: []
	},
	predicted_ratings: {
		type: Array,
		default: []
	},
	favorited_by: {
		type: Array,
		default: []
	},
	user_visit_info: {
		type: Array,
		default: []
	},
	recheck_needed: {
		type: Boolean,
		default: false
	},
	is_approved: {
		type: Boolean,
		default: false
	}
});

module.exports = movieSchema;