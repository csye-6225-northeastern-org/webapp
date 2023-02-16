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
    console.log("***** Entered Username : ", user.name);
    console.log("***** Entered Password : ", user.pass);
    userService.findOneByUsername(user.name)
    .then(result => {
        console.log("******* Result from authMiddleware : ", result);
        if(!result){
            res.status(401).send({"message" : "401 Unauthorized - No Authorization found"});
            return;
        }else{
            if(result.dataValues.userName === user.name){
                authUtils.comparePassword(user.pass, result.dataValues.password)
                .then( passwordCompare =>{
                    if(passwordCompare){
                        if(!req.params.id){
                            req.userInfo = result
                            next();
                        }else{
                            if(parseInt(result.dataValues.id) !== parseInt(req.params.id)){
                                res.status(403).send({"message" : "403 Forbidden - Id incorrect"});
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
    // console.log("User found : ", foundUser);

    // if (!foundUser || user.pass !== foundUser.password) {
    //   res.status(401).send({"message" : "401 Unauthorized - User not found"});
    //   return;
    // }
    // // Add the user to the request object
    // req.user = foundUser;

    // // Call the next middleware function
    // next();
  } catch (err) {
    res.status(500).send('Internal Server Error', err);
  }
}

module.exports = authMiddleware;
