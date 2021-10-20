const User=require('./../models/userModel');



exports.getSignupForm=(req,res)=>{
    res.status(200).render('signup');
}
exports.getLoginForm=(req,res)=>{
    res.status(200).render('login');
}

exports.getAccount=(req,res)=>{
    res.status(200).render('account');
}

exports.updateUserData=async(req,res,next)=>{
    const updatedUser =await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email
    },
    {
        new:true,
        runValidators:true
    }
    );
    //ek baar update ho gaya to accout page ko wapas render karenge
    res.status(200).render('account',{
        user:updatedUser//kyuki protected route purana wala user hai
    });

}



// exports.getAllUsers=async(req,res,next)=>{
//     try{
//         const users=await User.find();
//         res.status(200).json({
//             status:'success',
//             results:users.length,
//             data:{
//                 users:users,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });

//     }
    
// };
// exports.getUser=async(req,res,next)=>{
//     try{
//         const users=await User.findById(req.params.id);
//         res.status(200).json({
//             status:'success',
//             results:users.length,
//             data:{
//                 users:users,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });

//     }
// }
// exports.updateUser=async(req,res,next)=>{
//     try{
//         const users=await User.findById(req.params.id);
//         res.status(200).json({
//             status:'success',
//             results:users.length,
//             data:{
//                 users:users,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });

//     }
// }
// exports.deleteUser=async(req,res,next)=>{
//     try{
//         const users=await User.findById(req.params.id);
//         res.status(200).json({
//             status:'success',
//             results:users.length,
//             data:{
//                 users:users,
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });

//     }
// }

// exports.createUser=(req,res)=>{//this update fn is for administrator to update the data
//     try{  
//         res.status(500).json({
//             status:"error",
//             message:"this route is not defined, Please sinup instead",
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });

//     }
// }

// const filterObj=(obj, ...allowedFields)=>{
//     let newObj={};
//     Object.keys(obj).forEach(el=>{
//         if(allowedFields.includes(el)){
//             newObj[el]=obj[el];
//         }
//     });
//     return newObj;
// } 


// exports.updateMe=async(req,res,next)=>{//here user can update his name and email
//     try{   
//         //1.create error if user posts password data
//         if(req.body.password || req.body.passwordConfirm){
//             const err=new Error(`This route is not for password update.Please use /updatePassword.`);
//             err.status='fail';
//             err.statusCode=400;
//             return next(err);
//         }

//         //2.Filtered out unwanted fields name that are not allowed to be updated
//         const filteredBody=filterObj(req.body,'name','email');//hume bs do hi field allow karenge taki user role:'admin na kar sakt' warna directly req.body hi pass kar dete agar role ka lafda na hota to
//         //3.Update ser document
//         const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});//here we are using findByIdAndUpdate because here we not dealing with password and sensitive date
//                                                             //remeber req.user was added in protect middleware,new:true means naya object return karega aur validator me custom validator nai chalega kyuki update par wo kam nai karta
                                                        
//         res.status(200).json({
//             status:'success',
//             data:{
//                 user:updatedUser
//             }
//         })
//     }catch(err){
//         res.status(400).json({
//             status:'fail',
//             message:'Invalid data sent'
//         });
//     }
// };
// exports.deleteMe=async(req,res,next)=>{
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

// exports.getMe=(req,res,next)=>{//almost similary to getOne but here user won't pass his id
//     req.params.id=req.user.id;//here we have added id to the req and now it is similar to getOne
//     next();
// }

