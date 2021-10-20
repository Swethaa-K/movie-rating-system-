const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const {promisify}=require('util');
const sendEmail=require('./../utils/email');


const cookieOptions={
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
    // secure:true,//if we don't use https if won't work because of this line of code
    httpOnly:true,//will make sure that cookie will now can't be modified by browser
}

const signToken=id=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup=async(req,res,next)=>{
    try{
        const newUser=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
        });//ye method secure nai hai isliye hum aage ise change karenge
    
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        }); 
        res.cookie('jwt',token,cookieOptions);
        res.status(201).json({
            status:'success',
            token:token,
            data:{
                user:newUser,
            }
        })

    }catch(err){
        res.status(400).render('error',{
            message:'Something went wrong while signing... Please try again Later'
        });

    }
    
};
exports.login=async(req,res,next)=>{
    try{
        
        const {email,password}=req.body;//jab variable on left is property inside the object in es6 we can do this

        //1) if email and password exists
        if(!email || !password){
            return res.status(400).render('error',{
                message:'Please provide email and password!'
            });
        }
        //2) Check if user exists and password is correct
        const user=await User.findOne({email:email}).select('+password');//since we have hidden password so we need to bring it back using select
        if(!user || !await user.correctPassword(password,user.password)){//ye ek line me likhe hai taki hacker ko ye na pata chale ki password galat hai ya fir user hi nai hi uss id se
            return res.status(400).render('error',{
                message:'Incorrect password email or password'
            });
        }

        //3)if everything ok, send token to client
        const token=signToken(user._id);
        res.cookie('jwt',token,cookieOptions);
        res.status(200).json({
            status:'success',
            token:token,
        });

    }catch(err){
        return res.status(400).render('error',{
            message:'Something went wrong while logging'
        });
    }
};


exports.protect=async(req,res,next)=>{
    try{
        //1)Getting token and check if it's there
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){//when working with api or postman
            token =req.headers.authorization.split(' ')[1];//string after bearer is our token
        }else if(req.cookies.jwt){//when working from client side
            token=req.cookies.jwt
        };
        if(!token){
            return res.status(401).render('error',{
                message:'Your are not logged in! Plear log in to get access'
            })
            
        }


        //2)verify token(check if someone has manupulated the token or is it expired?)
        // jwt.verify(token,process.env.JWT_SECRET,callback fn)//chuki ye async hai isliye ease ke liye promisify kar do
        const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        //3)Check if user still exits
        const currentUser=await User.findById(decoded.id)//id is stored in the payload :)
        if(!currentUser){
            return res.status(401).render('error',{
                message:'The user belonging to this token no longer exits'
            })
        }
        //4)Check if user changed passworf after the token was issued
        if(currentUser.changesPasswordAfter(decoded.iat)){
            const err=new Error(`.`);
            return res.status(401).render('error',{
                message:'User recetly changed password! Please log in again'
            })
        };
        res.locals.user = currentUser;
        req.user=currentUser;//khuchh future me  use hoga
        next();

    }catch(err){
        return res.status(401).render('error',{
            message:'Something went wrong'
        })
    }
};

//only for rendered pages and not for error
exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
         console.log('no user')
          return next();
        }
        // 3) Check if user changed password after the token was issued
        if(currentUser.changesPasswordAfter(decoded.iat)){
            
            return next();
        };
        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        console.log('errror iin catch block')
        return next();
      }
    }
    next();
  };

exports.logout=(req,res)=>{
    res.cookie('jwt','dummy-text',{
        expires:new Date(Date.now()+10*1000),//10sec
        httpOnly:true
    });
    res.status(200).json({
        status:'success',
    })
}
// exports.restrictTo=(...roles)=>{//since we can't pass argument to middleware so this fn will actually return the actuall middle but with those can use its variable ie:roles variable
//     return (req,res,next)=>{     //this is the actuall middleware
//         if(!roles.includes(req.user.role)){//since protect fn always run before restrictTo fn so req.user property will be set by protect fn only in the last line of code
//             const err=new Error(`You do not have permission to perform the action`);
//             err.status='fail';
//             err.statusCode=403;
//             return next(err);        }
//         next();
//     }
    
// }
// exports.forgotPassword=async(req,res,next)=>{
//     try{
//         //1)get user based on posted email
//         const user=await User.findOne({email:req.body.email});//because user has only sent us the email so based on that we will search him
//         if(!user){
//             const err=new Error(`There is no user with email address`);
//             err.status='fail';
//             err.statusCode=404;
//             return next(err);  
//         }
//         //2)generate the random reset token(simple token ,not the strong bcrypt token )
//         const resetToken=user.createPasswordResetToken();
//         // console.log(resetToken);
//         await user.save({validateBeforeSave:false});//kyuki instance method ke through 2 naya property jo set kiye hai use save karna hai
//         //3)Send it to user's email
//         const resetURL=`${req.protocol}://${req.get('host')}/v1/users/resetPassword/${resetToken}`;
//         // console.log("resetUrl",resetURL);
//         const message=`forgot your password? Submit a PATCH request with your new pasword and passwordConfirm to:${resetURL}\n.If you din't forget your password,please igonore this email!`

//         try{//iss case me error thoda different hai isliye hum alag se try catch bana rahe hai
//             await sendEmail({//kyuki sendEmail ek argument lega(yaha object bhej rahe hai)
//                 email:user.email,
//                 subject:'Your password reset token (valid for 10 min)',
//                 message:message,
//             });
//             res.status(200).json({
//                 status:'success',
//                 message:'Token sent to email',
//             });

//         }catch(err){
//             user.passwordResetToken=undefined;
//             user.passwordResetExpires=undefined;
//             await user.save({validateBeforeSave:false});
//             const err2=new Error(`there was an error sendign the email. Try agian later`);
//             err2.status='fail';
//             err2.statusCode=500;
//             return next(err2);
//         }    

//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };

// exports.resetPassword=async(req,res,next)=>{
//     try{
//         //1.get user based on the token
//         const hashedToken =crypto.createHash('sha256').update(req.params.token).digest('hex');//since user ko unhashed token bhej rahe but data base me hashed wla available hai
//         const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});//and operation me2nd part ye hi ki expore time abhi ke time se bada hai to cool
//         //2.if token has not expired and there is user than set the new password
//         if(!user){
//             const err=new Error(`Token is invalid or has expired`);
//             err.status='fail';
//             err.statusCode=400;
//             return next(err);
//         }
//         user.password=req.body.password;
//         user.passwordConfirm=req.body.passwordConfirm;
//         user.passwordResetToken=undefined;
//         user.passwordResetExpires=undefined;
//         await user.save();//this time we won't turn off the validator becasue this time we want to validate everything like confirm password

//         //3.update changedPasswordAt property for the user
//         //isme humne mongoose middleware lagaya hai(pre save)

//         //4.log the user in,send the jwt
//         const token =signToken(user._id);
//         console.log('password changed');
//         res.status(200).json({
//             status:'success',
//             token:token,
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };

// exports.updatePassword=async(req,res,next)=>{
//     try{
//         //1.Get user from collection
//         const user=await User.findById(req.user.id).select('+password');//since before this route it will pass through protect route so req.user property will be set
//         if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){//correctPassword ek instance method hai jo hashed aur unhashed password compare kar ke deta hai
//             const err=new Error(`Your current password is wrong`);
//             err.status='fail';
//             err.statusCode=401;
//             return next(err);
//         }

//         //2.Check if POSETED Current password is correct
//         user.password=req.body.password;
//         user.passwordConfirm=req.body.passwordConfirm;
//         await user.save();
//         //3.If so, update password
        

//         //4.Log user in ,sent jwt() for new password
//         const token=signToken(user._id);
//         res.status(200).json({
//             status:'success',
//             token:token
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };
// exports.deleteMe=async(req,res,next)=>{//taki jab bhi ko find request kare to sirf active wala hi jaye
//     try{
//         await User.findByIdAndUpdate(req.user.id,{active:false});
//         res.status(204).json({
//             status:'success',
//             data:null
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };
