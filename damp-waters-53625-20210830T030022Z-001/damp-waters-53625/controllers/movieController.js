const Review=require('./../models/reviewModel');
const fetch = require('node-fetch');

function generateUrl(path){
    const url= `https://api.themoviedb.org/3${path}?api_key=2aa25f66fb51eaac2642e445f12d4f20`
    return url;
}

exports.getSearchResultMovies=(req,res,next)=>{
    console.log('query',req.query);
    const path='/search/movie';
    let newUrl=generateUrl(path);
    if(req.query.movieInput){
        newUrl=`${newUrl}&query=${req.query.movieInput}`
    }
    
    if(req.query.page){
        const currentPage=req.query.page *1;
        newUrl=`${newUrl}&page=${currentPage}`;
    }
    fetch(newUrl)
    .then((res)=>res.json())
    .then((data)=>{
        const movies=data.results;
        const totalPages=data.total_pages;
        console.log(totalPages);
        // console.log(totalPage,typeof totalPage);
        const currentPage=data.page;
        // console.log(currentPage,typeof currentPage);
        res.status(200).render('MoviesPopular',{
            movies:movies,
            currentPage:currentPage,
            totalPages:totalPages,
            title:'Your Result',
            route:`/v1/movie/searchResultMovies?movieInput=${req.query.movieInput}&`
        });
    })
    .catch((err)=>{
        res.status(400).render('error',{
            message:'Something went wrong... Please try again Later'
        });
    });
}
exports.getPopularMovies=(req,res,next)=>{
    // console.log(req.query);
    const path='/movie/popular';
    let newUrl=generateUrl(path);
    if(req.query.page){
        const currentPage=req.query.page *1;
        newUrl=`${newUrl}&page=${currentPage}`;
    }

    fetch(newUrl)
    .then((res)=>res.json())//convert json to js
    .then((data)=>{
        const movies=data.results;
        const totalPages=data.total_pages;
        //console.log(totalPages);
        // console.log(totalPage,typeof totalPage);
        const currentPage=data.page;
        // console.log(currentPage,typeof currentPage);
        res.status(200).render('MoviesPopular',{
            movies:movies,
            currentPage:currentPage,
            totalPages:totalPages,
            title:'Popular Movies',
            route:'/v1/movie/?'
        });
    })
    .catch((err)=>{
        res.status(400).render('error',{
            message:'Something went wrong... Please try again Later'
        });
    });
    
}
exports.getTopRatedMovies=(req,res,next)=>{
    const path='/movie/top_rated';
    let newUrl=generateUrl(path);
    if(req.query.page){
        const currentPage=req.query.page *1;
        newUrl=`${newUrl}&page=${currentPage}`;
    }
    fetch(newUrl)
    .then((res)=>res.json())
    .then((data)=>{
        const movies=data.results;
        const totalPages=data.total_pages;
        console.log(totalPages);
        // console.log(totalPage,typeof totalPage);
        const currentPage=data.page;
        // console.log(currentPage,typeof currentPage);
        res.status(200).render('MoviesPopular',{
            movies:movies,
            currentPage:currentPage,
            totalPages:totalPages,
            title:'Top Rated Movies',
            route:'/v1/movie/topRatedMovies/?'
        });
    })
    .catch((err)=>{
        res.status(400).render('error',{
            message:'Something went wrong... Please try again Later'
        });
    });
}


exports.getUpcomingMovies=(req,res,next)=>{
    const path='/movie/upcoming';
    let newUrl=generateUrl(path);
    if(req.query.page){
        const currentPage=req.query.page *1;
        newUrl=`${newUrl}&page=${currentPage}`;
    }
    fetch(newUrl)
    .then((res)=>res.json())
    .then((data)=>{
        const movies=data.results;
        const totalPages=data.total_pages;
        console.log(totalPages);
        // console.log(totalPage,typeof totalPage);
        const currentPage=data.page;
        // console.log(currentPage,typeof currentPage);
        res.status(200).render('MoviesPopular',{
            movies:movies,
            currentPage:currentPage,
            totalPages:totalPages,
            title:'Upcoming Movies',
            route:'/v1/movie/upcomingMovies/?'
        });
    })
    .catch((err)=>{
        res.status(400).render('error',{
            message:'Something went wrong... Please try again Later'
        });
    });
}

exports.getMovie=async(req,res,next)=>{
    try{
        const path=`/movie/${req.params.id}`;
        let newUrl=generateUrl(path);
        const reviews=await Review.find({tmdbMovieId:req.params.id});
        fetch(newUrl)
        .then((res)=>res.json())
        .then((data)=>{
            const movie=data;//it doen't have results since requesting a single movie
            res.status(200).render('MovieDetails',{
                movie:movie,
                reviews:reviews
            });
        })
        .catch((err)=>{
            console.log("error:",err);
        });
        // res.render('MovieDetails')
    }catch(err){
        res.status(400).render('error',{
            message:'Something went wrong... Please try again Later'
        });
    }
}



exports.getRatingPage=async(req,res,next)=>{
    try{
        res.status(200).render('ratingTemplate',{
            MovieId: req.params.MovieId,
        });
        
    }catch(err){
        res.status(400).render('error',{
            message:'unable to get Rating page',
            
        })
    }
}