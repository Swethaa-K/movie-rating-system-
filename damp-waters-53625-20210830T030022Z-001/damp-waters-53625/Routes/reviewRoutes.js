const express=require('express');
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authController')
const router=express.Router();
router.use(authController.isLoggedIn)
// router.route('/').get(reviewController.getAllReviews).post(authController.protect,reviewController.createReview);
                                                                                                //here we allowing only user(not admin or tour-guide to make review)
module.exports=router;