var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var webSeriesSchema = new mongoose.Schema({
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
	language: {
		type: Number,
		required: true
	},
	subtitles: {
		type: Array,
		default: []
	},
	seasons: {
		type: Array,
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
	tv_pg_rating: {
		type: String,
		default: "TV-Y"
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
	is_running_now: {
		type: Boolean,
		default: false
	},
	showing_at: {
		type: Array,
		default: []
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
	}
});

module.exports = webSeriesSchema;
