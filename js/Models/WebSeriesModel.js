var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var webSeriesSchema = new mongoose.Schema({
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
    startDate:{
        type:Date,
        required: true
    },
    endDate:{
        type:Date
    },
    artists:{
        type:[String],
        required:true
    },
    director:{
        type: String,
        required:true
    },
    genres:{
        type:[Number],
        required:true
    },
    season:{
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
    isSponsored:{
        type:Boolean,
        default:false
    },
    hasStarted:{
        type:Boolean,
        default:false
    },
    hasEnded:{
        type:Boolean,
        default:false
    },
    currentEpisode:{
        type:Number,
        default: 0
    },
    currentEpisodeDescription:{
        type:String,
        default:"NA"
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

module.exports = webSeriesSchema;