const mongoose = require("mongoose");

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty']
    },
    rating:{
        type:Number,
        min:[1,'Rating must be above 1'],
        max:[10,'Rating must be less than 10'],
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    tmdbMovieId:{
        type:Number,
        required:[true,'Review must belong to a Movie'],
    },
    user:{//parent referencing
        type:mongoose.Schema.ObjectId,//it will store object referencing to user
        ref:'User',
        required:[true,'Review must belong to a user'],
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

reviewSchema.index({tmdbMovieId:1,user:1},{unique:true});

reviewSchema.pre(/^find/,function(next){
    this.populate({//since we are populating 2 fields together we simply chain it like this
        path:'user',
        select:'name role',//display only name and photo of the user
    })
    next();  
});

const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;