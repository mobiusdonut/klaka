var login =function(user,password){console.log(user,password)
    if(user==="admin" && password==="admin"){
        return true;
    }
    else{
        return false;
    }
}
module.exports=login;
