const express=require('express');
const userController=require('../controllers/userController');
const authController=require('./../controllers/authController');
const router=express.Router();
router.use(authController.isLoggedIn)


router.route('/signupViews').get(authController.isLoggedIn,userController.getSignupForm);
router.route('/loginViews').get(authController.isLoggedIn,userController.getLoginForm);
router.route('/meViews').get(authController.protect,userController.getAccount);
router.route('/submit-user-data').post(authController.protect,userController.updateUserData);



router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);//we are not sending any data


// router.post('/forgotPassword',authController.forgotPassword);
// router.patch('/resetPassword/:token',authController.resetPassword);

// router.patch('/updateMyPassword',authController.protect,authController.updatePassword);

// router.get('/me',authController.protect,userController.getMe,userController.getUser);
// router.patch('/updateMe',authController.protect,userController.updateMe);
// router.delete('/deleteMe',authController.protect,userController.deleteMe);




module.exports=router;