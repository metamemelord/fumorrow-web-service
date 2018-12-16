var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var mobilePhoneSchema = new mongoose.Schema({
	_id: {
		type: Schema.ObjectId,
		required: true
	},
	uid: {
		type: String,
		lowercase: true,
		required: true
	},
	name: {
		type: String,
		lowercase: true,
		required: true
	},
	release_date: {
		type: Date,
		required: true
	},
	brand: {
		type: String,
		lowercase: true,
		required: true
	},
	price: {
		type: Array,
		default: []
	},
	form_factor: {
		type: String,
		default: "Phone"
	},
	flash_sale: {
		type: Array,
		default: []
	},
	memory: {
		ram: {
			type: String,
			required: true
		},
		internal_storage: {
			type: String,
			required: true
		},
		expandable_storage: {
			type: String,
			required: true
		}
	}, 
	camera: {
		primary: {
			specification: {
				type: String,
				required: true
			},
			video_sepcification: String,
			features: String
		},
		secondary: {
			specification: {
				type: String,
				required: true
			},
			video_sepcification: String,
			features: String
		},
		flash: String
	},
	connectivity: {
		supported_networks: String,
		internet_connectivity: Boolean,
		bluetooth: String,
		wifi: String,
		nfc: Boolean,
		audio_jack: Boolean
	},
	battery: {
		type: String,
		required: true
	},
	build: {
		dimensions: {
			height: Number,
			width: Number,
			depth: Number
		},
		weight: Number
	},
	sensors: {
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

module.exports = mobilePhoneSchema;