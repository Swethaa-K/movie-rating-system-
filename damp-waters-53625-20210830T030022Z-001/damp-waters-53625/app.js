const express=require('express');
const mongoose=require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const fetch = require('node-fetch');
const path =require('path');
const mongoSanitize=require('express-mongo-sanitize');
const movieRouter=require('./Routes/movieRoutes');
const userRouter=require('./Routes/userRoutes');
const reviewRouter=require('./Routes/reviewRoutes');;
const cookieParser=require('cookie-parser');

const app=express();

//====== connect to remote database==============
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);//simply we are replacing password with real password
mongoose.connect(DB,{//simply connecting with the database
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con=>{
    // console.log(con.connections);
    console.log('DB Connected successfully');
});
// ==========================================


app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(`${__dirname}/public`));

app.use(express.json());//parses data from the body
app.use(cookieParser());//parses data from the cookie
app.use(express.urlencoded({extended:true, limit:'10kb'}));
app.use(mongoSanitize());

// app.use((req,res,next)=>{
//     // console.log(req.cookies);
//     next();
// })
app.get('/',(req,res)=>{
    res.redirect('/v1/movie');
})
app.use('/v1/movie', movieRouter); 
app.use('/v1/users', userRouter);
app.use('/v1/reviews', reviewRouter);

app.all('*',(req,res,next)=>{//all means all kind of request (get,post,patch,delete etc)
    // res.status(404).json({
    //   status:'fail',
    //   message:`Can't find ${req.originalUrl} on this server`//req.originalUrl holds the value of url that has been requested
    // });
    const err=new Error(`sorry Can't find ${req.originalUrl} on this server`);
    err.status='fail';
    err.statusCode=404;
  
    next(err);
  
  });
app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status ||'error';
  
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    });
});

// app.listen(3000,()=>{
//     console.log('app started ');
// });
let port = process.env.PORT || 3000;
app.listen(port);