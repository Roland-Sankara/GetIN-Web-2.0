const api = require('./index');
const addr = require('../env_config').default;
const sessionStorage = window.sessionStorage;
const token = sessionStorage.getItem("token");

exports.login =  function(data, callback){
    api.post(addr+"/auth/login/",
    {"content-type": "application/json",

},data, function(error, token){
        //callback of the method here
        console.log("error", error);
         if(error){
            console.log(error);
            return callback(error);
         }else{
            return callback(null, token.auth_token);
         }
        });
}

exports.verifyToken =  function(callback){
    api.get(addr+"/auth/me/",
    {
       "content-type": "application/json",
       "Authorization": "Token "+token
   },function(error, response){
        //callback of the method here
        console.log("error", error);
         if(error){
            console.log(error);
            return callback(error);
         }else{
              if (response.status != 200) {
                 return callback("Not authorised, please login");
             }
              else{
                return callback(null, response.data);
              }
            
         }
        });
}

exports.mappedGirls =  function(callback){
    api.get(addr+"/api/v1/girls",
    {
       "content-type": "application/json",
       "Authorization": "Token "+token
   },function(error, response){
        //callback of the method here
        console.log("error", error);
         if(error){
            console.log(error);
            return callback(error);
         }else{
              if (response.status != 200) {
                 return callback("Couldnot get mapped girls");
             }
              else{
                return callback(null, response.data);
              }
            
         }
        });
}