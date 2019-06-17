var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var frontendSchema = new mongoose.Schema({
    _id:{
        type: Schema.ObjectId,
        required: true
    },
    uid: {
		type: String,
		lowercase: true,
		required: true
	},
    name:{
        type: String,
        required: false,
    },
    links:{
        type: Array,
        default: [],
    },
    color:{
        type: Array,
        default: [],
    },
    labels:{
        type: Array,
        default: [],
    },
    extras:{
        type: Array,
        default: [],
    }
});

module.exports = frontendSchema;