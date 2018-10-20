var mongoose = require('mongoose');
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
    composer: {
        type: String,
        required: false
    },
    engine: {
        type: String,
        required: false
    },
    writer: {
        type: String,
        required: false
    },
    designer: {
        type: String,
        required: false
    },
    developer: {
        type: String,
        required: false
    },
    series: {
        type: String,
        required: false
    },
    publisher: {
        type: String,
        required: false
    },
    platform: {
        type: String,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    modes: {
        type: String,
        required: false
    },
    awards: {
        type: String,
        required: false
    },
    trivia: {
        type: String,
        required: false
    },
    trailers: {
        type: Array,
        default: []
    },
    peervideo: {
        type: Array,
        default: []
    },
    buy_website: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    referrer_name: {
        type: String,
        lowercase: true,
        required: true
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

module.exports = videoGamesSchema;