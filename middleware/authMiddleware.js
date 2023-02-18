const basicAuth = require('basic-auth');
const UserService = require("../services/userService");
const authUtils = require("../utils/authUtils");

async function authMiddleware(req, res, next) {
  const user = basicAuth(req);
  let userService = new UserService();

  if (!user || !user.name || !user.pass) {
    res.status(401).send({"message" : "401 Unauthorized - Invalid username/password"});
    return;
  }

  try {

    userService.findOneByUsername(user.name)
    .then(result => {
        if(!result){
            res.status(401).send({"message" : "401 Unauthorized "});
            return;
        }else{
            if(result.dataValues.userName === user.name){
                authUtils.comparePassword(user.pass, result.dataValues.password)
                .then( passwordCompare =>{
                    if(passwordCompare){
                        if(!req.params.id){
                            req.userInfo = result
                            next();
                        }else if(req.prodInfo){
                            console.log("******** INSIDE AUTH MIDDLE-WARE PROD-LEVEL ********");
                            const prodInfo = req.prodInfo;
                            if(prodInfo.dataValues.owner_user_id !==  result.dataValues.id){
                                res.status(403).send({"message" : "403 Forbidden - Product Update Forbidden"});
                            }else{
                                req.userInfo = result
                                next();
                            }
                        } 
                        else{
                            if(parseInt(result.dataValues.id) !== parseInt(req.params.id)){
                                res.status(403).send({"message" : "403 Forbidden - Not Allowed"});
                                return;
                            }else{
                                req.userInfo = result
                                next();
                            }
                        }
                    }else{
                        res.status(401).send({"message" : "401 Unauthorized - Invalid Password"});
                        return;
                    }
                })
            }else{
                res.status(401).send({"message" : "401 Unauthorized"});
                return;
            }
        }
    })  
    .catch(error => {
        console.log("***** Error : ", error);
    })
   
  } catch (err) {
    res.status(500).send('Internal Server Error', err);
  }
}

module.exports = authMiddleware;
