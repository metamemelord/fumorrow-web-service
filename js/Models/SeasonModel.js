var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var seasonSchema = new mongoose.Schema({
    start_date: {
		type: Date,
		required: false
	},
	end_date: {
		type: Date,
		default: null
	},
    subtitles: {
        type: Array,
        default: []
    },
    series_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Serie"
	},
	season_number: {
		type: Number,
		required: true
	},
    snapshot: String,
    cast: {
		type: Array,
		required: true
	},
	crew: {
		type: Array,
		required: true
    },
    language: Number,
	episodes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
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
    showing_at: {
        type: Array,
        default: []
    },
	tv_pg_rating: {
		type: String,
		default: "TV-Y"
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
    }
});

module.exports = seasonSchema;
