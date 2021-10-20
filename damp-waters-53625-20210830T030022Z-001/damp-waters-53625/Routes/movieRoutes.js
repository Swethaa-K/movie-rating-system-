const express=require('express');
const movieController=require('../controllers/movieController');
const authController=require('./../controllers/authController');
const reviewController=require('./../controllers/reviewController')
const router=express.Router();

router.use(authController.isLoggedIn);//should run for every single route

router.route('/').get(movieController.getPopularMovies);

router.route('/topRatedMovies').get(movieController.getTopRatedMovies);
router.route('/upcomingMovies').get(movieController.getUpcomingMovies);
router.route('/searchResultMovies').get(movieController.getSearchResultMovies);

router.route('/:id').get(movieController.getMovie);
router.route('/:MovieId/RateMovie').get(authController.protect,movieController.getRatingPage);
router.route('/:MovieId/RateMovie').post(authController.protect,reviewController.createMovieReview);
router.route('/:MovieId/RateMovie/:ReviewId/update').get(authController.protect,reviewController.getMovieReviewPage).post(authController.protect,reviewController.updateReview);
router.route('/:MovieId/RateMovie/:ReviewId/delete').get(authController.protect,reviewController.deleteReview)

// router.route('/:MovieId/reviews').post(authController.protect,reviewController.createReview);
module.exports=router;
