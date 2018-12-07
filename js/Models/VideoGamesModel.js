var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var videoGamesSchema = new mongoose.Schema({
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
	directors: {
		type: Array,
		default: []
	},
	composers: {
		type: Array,
		default: []
	},
	engine: {
		type: String,
		required: false
	},
	writers: {
		type: Array,
		default: []
	},
	designers: {
		type: Array,
		default: []
	},
	developers: {
		type: Array,
		default: []
	},
	series: {
		type: String,
		required: false
	},
	platforms: {
		type: Array,
		default: []
	},
	genres: {
		type: Array,
		default: []
	},
	modes: {
		type:Array,
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
	awards: {
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
	},
});

module.exports = videoGamesSchema;