const User = require('../models/userModel');
const { findById } = require('./../models/reviewModel');
const Review=require('./../models/reviewModel');
// exports.getAllReviews=async(req,res,next)=>{
//     try{
//         const reviews=await Review.find();

//         res.status(200).json({
//             status:'success',
//             results:reviews.length,
//             data:{
//                 reviews:reviews,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
    
// };

exports.createMovieReview=async(req,res,next)=>{
    try{
        req.body.tmdbMovieId=req.params.MovieId*1;
        req.body.rating=req.body.rating*1;
        req.body.user=req.user.id;//req.user from protect route
        const newReview=await Review.create(req.body);
        const userUpdating=await User.findById(req.user.id);
        let x=userUpdating.totalVotes;
        x=x+1;
        const userAfterUpdating=await User.findByIdAndUpdate(req.user.id,{totalVotes:x});
        if(x==10){
            const userAfterUpdating=await User.findByIdAndUpdate(req.user.id,{role:"expert"});
        }
        res.status(200).render('success',{
            message:'Thank you for your submission'
        });
    }catch(err){
        if(err.code===11000)
        {
            res.status(400).render('error',{
                message:' You have already rated this movie'
            });
        }else{
            res.status(400).render('error',{
                message:'Something Went wrong... please try again later'
            });
        }
        
    }
};


exports.getMovieReviewPage=async(req,res,next)=>{
    try{
        const MovieId=req.params.MovieId;
        const ReviewId=req.params.ReviewId;
        const reviewUpdating=await Review.findById(ReviewId);
        res.status(200).render('reviewEditTemplate',{
            MovieId,
            reviewUpdating
        })
    }catch(err){
        console.log(err);

    }
};

exports.updateReview=async(req,res,next)=>{
    try{
        req.body.review=req.body.review;
        req.body.rating=req.body.rating*1;
        const updatedReview=await Review.findByIdAndUpdate(req.params.ReviewId,req.body,{
            new:true,//this is true because we want to return updated document
            runValidators:true,
        })
        console.log(updatedReview);
        res.status(200).render('success',{
            message:'Thank you for your submission'
        });
    }catch(err){
        res.status(400).render('error',{
            message:'Something Went wrong... please try again later'
        });
    }
};


exports.deleteReview=async(req,res,next)=>{
    try{
        await Review.findByIdAndDelete(req.params.ReviewId);
        res.status(200).render('success',{
            message:'Thank you for your submission'
        });
    }catch(err){
        res.status(400).render('error',{
            message:'Something Went wrong... please try again later'
        });
    }
};
// exports.createReview=async(req,res,next)=>{
//     try{
//         console.log('hii');
//         req.body.tmdbMovieId=req.params.MovieId*1;
//         req.body.user=req.user.id;//req.user from protect route
//         const newReview=await Review.create(req.body);
//         res.status(200).json({
//             status:'success',
//             data:{
//                 review:newReview,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };