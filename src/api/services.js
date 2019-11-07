const api = require("./index");
const addr = require("../env_config").default;
const sessionStorage = window.sessionStorage;
const token = sessionStorage.getItem("token");

exports.login = function(data, callback) {
  api.post(
    addr + "/auth/login/",
    { "content-type": "application/json" },
    data,
    function(error, token_) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        return callback(null, token_.auth_token);
      }
    }
  );
};

exports.addChew = function(data, callback) {
  api.post(
    addr + "/api/v1/chews",
    { "content-type": "application/json", Authorization: "Token " + token },
    data,
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        return callback(null, response);
      }
    }
  );
};
exports.addMidwife = function(data, callback) {
  api.post(
    addr + "/api/v1/midwives",
    { "content-type": "application/json", Authorization: "Token " + token },
    data,
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        return callback(null, response);
      }
    }
  );
};
exports.addAmbulance = function(data, callback) {
  api.post(
    addr + "/api/v1/ambulances",
    { "content-type": "application/json", Authorization: "Token " + token },
    data,
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        return callback(null, response);
      }
    }
  );
};

exports.verifyToken = function(callback) {
  api.get(
    addr + "/auth/me/",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Not authorized, please login");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};

exports.usersChew = function(callback) {
  api.get(
    addr + "/api/v1/chews",
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
                 return callback("Couldnt get mapped chews");
             }
              else{
                return callback(null, response.data);
              }
            
         }
        });
}
exports.getHealthFacilities =  function(callback){
   api.get(addr+"/api/v1/healthfacilities",
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
                return callback("Couldnt get health facilities");
            }
             else{
               return callback(null, response.data);
             }
           
        }
       });
}

exports.usersMidwives =  function(callback){
   api.get(addr+"/api/v1/midwives",
   {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnt get mapped chews");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};
exports.usersMidwives = function(callback) {
  api.get(
    addr + "/api/v1/midwives",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldn't get mapped midwives");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};

exports.usersAmbulanceDrivers = function(callback) {
  api.get(
    addr + "/api/v1/ambulances",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldn't get mapped ambulance drivers");
        } else {
          return callback(null, response.data);
        }
      }
       });

};

exports.followUps =  function(from, to, callback){
   api.get(addr+"/api/v1/followups?created_from="+from+"&created_to="+to,
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
                return callback("Couldnot get follow ups");
            }
             else{
               return callback(null, response.data);
             }
           
        }
       });
}
exports.getSubCounties =  function(callback){
   api.get(addr+"/api/v1/subcountys",
   {
      }
    
  );
}
exports.mappedGirls = function(from, to, callback) {
  api.get(
    addr + "/api/v1/girls?created_from="+from+"&created_to="+to,
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnot get mapped girls");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};
exports.deliveries = function(delivery_location, from, to, callback) {
   api.get(
     addr + "/api/v1/deliveries?delivery_location="+delivery_location+"&&created_from="+from+"&created_to="+to,
     {
       "content-type": "application/json",
       Authorization: "Token " + token
     },
     function(error, response) {
       //callback of the method here
       console.log("error", error);
       if (error) {
         console.log(error);
         return callback(error);
       } else {
         if (response.status != 200) {
           return callback("Failed get deliveries");
         } else {
           return callback(null, response.data);
         }
       }
     }
   );
 };
exports.getSubCounties = function(callback) {
  api.get(
    addr + "/api/v1/subcountys",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnot get subcounties");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};

exports.getHealthFacilities = function(callback) {
  api.get(
    addr + "/api/v1/healthfacilitys",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnot get subcounties");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};

exports.getParishes = function(callback) {
  api.get(
    addr + "/api/v1/parishes",
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnot get parishes");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};


exports.Appointments = function(status, from, to, callback) {
  api.get(
    addr + "/api/v1/appointments?status="+status+"&created_from="+from+"&created_to="+to,
    {
      "content-type": "application/json",
      Authorization: "Token " + token
    },
    function(error, response) {
      //callback of the method here
      console.log("error", error);
      if (error) {
        console.log(error);
        return callback(error);
      } else {
        if (response.status != 200) {
          return callback("Couldnot get parishes");
        } else {
          return callback(null, response.data);
        }
      }
    }
  );
};
