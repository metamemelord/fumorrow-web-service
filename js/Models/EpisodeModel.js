var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var episodeSchema = new mongoose.Schema({
    date: {
        value: Date,
        tentative: Boolean
    },
    title: String,
    runtime: Number,
    summary: String,
    season_id: {
        type: Schema.Types.ObjectId,
        ref: "Season"
    },
    episode_number: {
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
    is_sponsored: {
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

module.exports = episodeSchema;
