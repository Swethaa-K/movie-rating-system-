const mongoose=require('mongoose');
 const validator=require('validator');
 const bcrypt=require('bcryptjs');
 const crypto=require('crypto');//built in hai isliye install nai hoga.(for resetToken encryption)
 const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user must have a name'],
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
				//3rd party validator for a email

    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:[6,'A password must be 6 digits long'],
		//only one rule,if you want you can add extra rule
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{//custome validator
            //This only works on SAVE and create !!! not on update
            validator:function(el){//returing true means success false means failure
                return el===this.password;
            },
            message:'Passwords are not the same',//will display this message if password is wrong
        },
    },
    role:{//types of user we want
        type:String,
        enum:['user','expert','admin'],
        default:'user',//by default role we will be user unless explicitly mentioned
    },
    totalVotes:{
        type:Number,
        default:0,
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,//by default everyone is active user
        select:false,//we don't want to show it anyone
    }

 });
// instance method of user
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){//we are passing user password because we have hidden it,otherwise we would have use this.password but sadly not this time
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changesPasswordAfter=function(JWTTimestamp){//jwttimestanp was time when user was issued token
    if(this.passwordChangedAt){//this property will exits only when someone has changed the password else there won't be such property
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);//JWTTimestamp se compare karna ke liye khuchh modification chahiye
        return JWTTimestamp<changedTimestamp;//true means password is changed(here time is in second) yani agar timestamp bada hai iska matlab password pahle bana tha aur timestamp pahle yani password not changed
    }
    return false;//by default we will return false which means user has not changed password
}

// comment
// userSchema.methods.createPasswordResetToken=function(){
//     const resetToken=crypto.randomBytes(32).toString('hex');//koi bhi token bana ke de dega in plain text(not encrypted)
//     this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');//hamare resetToken ko encrypt kar diya

//     this.passwordResetExpires=Date.now()+10*60*1000;//10 min expiry time hai
//     return resetToken;//yahi unencrypted wale ko  bhejna hai ,warna agar encrypted ko hi bhejna tha to fayada kya fir(kyuki db me encrpyted to pada hi hai)
// }


// mongoose middleware
//for updating passwordChangedAt property
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew){//ya to passowrd modify na hua ho ya to naya naya bana ho to igonore karo
        return next();
    }
    this.passwordChangedAt=Date.now()-1000;//kyuki password change hone me kabhi kabhi 1 sec upar lag jata hai to usi ko ye componsate kar dega
    next();

});
 userSchema.pre('save',async function(next){//async because of hash
    if(!this.isModified('password')){//if password is not modified(updates) or create than continue
        return next();
    }else{//encrypt it before save to the database
        this.password=await bcrypt.hash(this.password,12);//since callback therefore use asyn version of hash (tough sync version  is also available)
                                                        //yaha 12 ek parameter jitna numerical bada hoga utna strong encryption but more time taking(intense)
        this.passwordConfirm=undefined;//remember we have already confirm password so that user galti na kare,
                                       //we no longer need this field
        next();
    }                                                     
});


 //create model
 const User=mongoose.model('User',userSchema);
 module.exports=User;