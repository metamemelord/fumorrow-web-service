var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var movieSchema = new mongoose.Schema({
    _id:{
        type: Schema.ObjectId,
        required: true
    },
    uid:{
        type: String,
        lowercase:true,
        required: true
    },
    title:{
        type: String,
        lowercase:true,
        required:true
    },
    date:{
        type:Date,
        required: true
    },
    artists:{
        type:[String],
        required:true
    },
    directedBy:{
        type: String,
        required:true
    },
    genres:{
        type:[Number],
        required:true
    },
    runtime:{
        type:Number,
        default:0
    },
    language:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageProvider:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    referrerName:{
        type:String,
        lowercase:true,
        required:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    showingAt:{
        type: Array,
        default: []
    },
    isSponsored:{
        type:Boolean,
        default:false
    },
    hasPassed:{
        type:Boolean,
        default:false
    },
    clickCounter:{
        type:Number,
        default:0
    },
    isChecked:{
        type:Boolean,
        default: false
    },
    isApproved:{
        type:Boolean,
        default: false
    }
});

module.exports = movieSchema;