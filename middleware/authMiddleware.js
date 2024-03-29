const basicAuth = require('basic-auth');
const UserService = require("../services/userService");
const authUtils = require("../utils/authUtils");
const logger = require("../utils/logger");

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
                        ("************ AFTER PASSWORD COMPARE product Info : ", req.prodInfo)
                        logger.info("************ Request Params id : ", req.params.id);
                        if(!req.params.id){
                            logger.info("##### Inside If block of params-id : ")
                            req.userInfo = result
                            if(req.prodInfo){
                                const prodInfo = req.prodInfo;
                                if(prodInfo.dataValues.owner_user_id !==  result.dataValues.id){
                                    res.status(403).send({"message" : "403 Forbidden - Product Update Forbidden"});
                                }else{
                                    next();
                                }
                            }else{
                                next();
                            }

                        }else if(req.imageInfo && req.prodInfo){
                            logger.info("******** INSIDE AUTH MIDDLE-WARE IMAGE INFO ********");
                            const imageInfo = req.imageInfo;
                            const prodInfo = req.prodInfo;
                            if(prodInfo.dataValues.owner_user_id !==  result.dataValues.id){
                                res.status(403).send({"message" : "403 Forbidden - Product Update Forbidden"});
                            }else{
                                req.userInfo = result
                                next();
                            }
                        }else if(req.prodInfo){
                            logger.info("******** INSIDE AUTH MIDDLE-WARE PROD-LEVEL ********");
                            const prodInfo = req.prodInfo;
                            if(prodInfo.dataValues.owner_user_id !==  result.dataValues.id){
                                res.status(403).send({"message" : "403 Forbidden - Product Update Forbidden"});
                            }else{
                                req.userInfo = result
                                next();
                            }
                        } 
                        else{
                            logger.info("######## Inside ELSE AUTH MIDDLE WARE ##########");
                            logger.info("Result DataValues id :  ", result.dataValues.id);
                            logger.info("Request Params Id :  ", req.params.id);
                            if(parseInt(result.dataValues.id) !== parseInt(req.params.id)){
                                logger.info("********** Inside Incorrect Ids ELSE BLOCK **********")
                                res.status(403).send({"message" : "403 Forbidden - Not Allowed"});
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
        logger.info("***** Error : ", error.message);
    })
   
  } catch (err) {
    res.status(500).send('Internal Server Error', err);
  }
}

module.exports = authMiddleware;
