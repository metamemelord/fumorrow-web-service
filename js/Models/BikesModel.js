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
        type: Number,
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
    related_videos: {
        type: Array,
        required: false
    },
    related_bikes: {
        type: Array,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    key_features: {
        type: String,
        required: false
    },
    image_provider: {
        type: Array,
        lowercase: true,
        required:false
    },
    image_url: {
        type: Array,
        default: []
    },
    referrer_name: {
        type: String,
        lowercase: true,
        required: false
    },
    redirect_url: {
        type: String,
        required: false
    },
    is_sponsored: {
        type: Boolean,
        default: false
    },
    is_sponsored_banner: {
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

module.exports = bikeSchema;