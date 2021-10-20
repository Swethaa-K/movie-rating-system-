const buttonElement=document.querySelector('#search');
const inputElement=document.querySelector('#inputValue');

//listening for trailer
document.onclick=function(event){
    //check for trailer button
    // console.log(event);
    var btnClassList=event.target.getAttribute("class").split(' ');
    if(btnClassList[0]==='trailer'){
        const movieId=event.target.dataset.movieId;
        const newUrl=`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=2aa25f66fb51eaac2642e445f12d4f20`
        fetch(newUrl)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.results[0]){
                const videoKey=data.results[0].key;
                if(videoKey){
                    let videoUrl=`https://www.youtube.com/embed/${videoKey}`;
                    window.open(videoUrl);
                }
            }
            else{
                alert('sorry! No trailer available');
            } 
        })
        .catch((err)=>{
            console.log("error:",err);
        });
    }
}


    