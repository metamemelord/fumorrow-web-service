var mongoose = require('mongoose');
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
    artists: {
        type: Array,
        required: true
    },
    directors: {
        type: Array,
        required: true
    },
    producers: {
        type: Array,
        default: []
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
    description: {
        type: String,
        required: true
    },
    image_provider: {
        type: String,
        lowercase: true,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    referrer_name: {
        type: String,
        lowercase: true,
        required: true
    },
    redirect_url: {
        type: String,
        required: true
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
    trivia: {
        type: Array,
        default: []
    },
    trailers: {
        type: Array,
        default: []
    },
    teasers: {
        type: Array,
        default: []
    },
    related_videos: {
        type: Array,
        default: []
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
    is_partner_sponsored: {
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
});

module.exports = movieSchema;