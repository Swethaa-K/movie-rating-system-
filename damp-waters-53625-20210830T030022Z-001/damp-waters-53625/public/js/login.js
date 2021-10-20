// import axios from 'axios';
const signup=async(name,email,password,passwordConfirm)=>{

    try{
        const res =await axios({
            method:'POST',
            url:'https://damp-waters-53625.herokuapp.com/v1/users/signup',
            data:{
                name:name,
                email:email,
                password:password,
                passwordConfirm:passwordConfirm
            }
        });
        if(res.data.status==='success'){//if successful reload the page,so that we can see changes
            alert('Welcome');
            window.setTimeout(()=>{
                location.assign('/v1/movie');
            },1500);
        }
        console.log(res);
    }catch(err){
        alert(err.response.data.message);
    }
}
const login=async(email,password)=>{

    try{
        console.log('inside login block')
        const res =await axios({
            method:'POST',
            url:'https://damp-waters-53625.herokuapp.com/v1/users/login',
            data:{
                email:email,
                password:password,
            }
        });
        if(res.data.status==='success'){//if successful reload the page,so that we can see changes
            window.setTimeout(()=>{
                location.assign('/v1/movie');
            },500);
        }
        console.log(res);
    }catch(err){
        alert(err.response.data.message);
    }
}


const logout=async()=>{
    try{
        const res =await axios({
            method:'GET',
            url:'https://damp-waters-53625.herokuapp.com/v1/users/logout',
            
        });
        if(res.data.status==='success'){//if successful reload the page,so that we can see changes
            location.reload(true);//will reload from the server,yani agar cache me bhi khchh hoga to it won't affect
        }
    }catch(err){
        alert('error while logging you out! please try again');
    }
}

const SingUpBtn=document.querySelector('.signup-form');
if(SingUpBtn){
    SingUpBtn.addEventListener('submit',e=>{
        e.preventDefault();
        const name=document.getElementById('nameId').value;
        const email=document.getElementById('emailId').value;
        const password=document.getElementById('passwordId').value;
        const passwordConfirm=document.getElementById('passConfirmId').value;
        signup(name,email,password,passwordConfirm);
    });
}
const logInBtn=document.querySelector('.login-form');
if(logInBtn){
    logInBtn.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('exampleInputEmail1').value;
        const password=document.getElementById('exampleInputPassword1').value;
        login(email,password);
    });
}



const logOutBtn=document.querySelector('.log-out');
if(logOutBtn){
    logOutBtn.addEventListener('click',logout);
}



