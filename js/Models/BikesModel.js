var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bikeSchema = new mongoose.Schema({
    _id: {
        type: Schema.ObjectId,
        required: true
    },
    uid: {
        type: String,
        lowercase: true,
        required: true
    },
    brand_name: {
        type: String,
        lowercase: true,
        required: true
    },
    bike_name: {
        type: String,
        lowercase: true,
        required: true
    },
    bike_type: {
        type: Number,
        required: false
    },
    price: {
        type: Array,
        required: false
    },
    release_date: {
        type: Date,
        required: true
    },
    colors: {
        type: Array,
        required: false
    },
    mileage: {
        type: Number,
        required: false
    },
    engine_displacement: {
        type: Number,
        required: false
    },
    headlamps: {
        type: String,
        required: false
    },
    tyre_type: {
        type: String,
        required: false
    },
    power: {
        type: String,
        required: false
    },
    gear_box: {
        type: Number,
        required: false
    },
    ABS: {
        type: Boolean,
        required: false
    },
    wheel_type: {
        type: String,
        required: false
    },
    top_speed: {
        type: Number,
        required: false
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
    related_bikes: {
        type: Array,
        required: false
    },
    key_features: {
        type: String,
        required: false
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

module.exports = bikeSchema;