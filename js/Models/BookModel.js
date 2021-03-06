var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bookSchema = new mongoose.Schema({
	_id: {
		type: Schema.ObjectId,
		required: true
	},
	uid: {
		type: String,
		lowercase: true,
		required: true
	},
	book_name: {
		type: String,
		lowercase: true,
		required: true
	},
	release_date: {
		type: Date,
		required: true
	},
	publication_year: {
		type: Number,
		required: false
	},
	edition: {
		type: Number,
		required: false
	},
	pages: {
		type: Number,
		required: false
	},
	weight: {
		type: Number,
		required: false
	},
	author: {
		type: Array,
		required: true
	},
	ISBN: {
		type: String,
		required: false
	},
	price: {
		type: Number,
		required: false
	},
	language: {
		type: Number,
		required: true
	},
	binding: {
		type: String,
		required: false
	},
	publisher: {
		type: String,
		required: false
	},
	genres: {
		type: Array,
		required: true
	},
	similar_books: {
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
	}
});

module.exports = bookSchema;