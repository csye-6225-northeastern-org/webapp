const validations = require('../utils/validations');
const utils = require('../utils/utils');
const bcrypt = require("bcrypt");

const User = require('../models/users');

const saltRounds = 10;

function checkInput(req, res){
    const { id } = req.params;
    if(!validations.validateId(id)){
        return true;
    }else{
        return false;
    }
}

function checkAuthHeaders(req, res){
    const auth = req.headers.authorization;
    const credentials = utils.getCredentialsIfPresent(auth);
    if(credentials.status){
        const username = credentials.username;
        const password = credentials.password;
        return {username, password};
    }else{
        return {};
    }
}

function isObjEmpty(obj) {
    return JSON.stringify(obj) === '{}';
}


async function getSingleUserRecord(req, res, username){
    const { id } = req.params;
    return await User.findOne({
        where : { id }
    }).then( result => {
                if(!result){
                    res.status(400).send({"message" : "400 Bad Request"});
                }else if(result.dataValues.userName !== username){
                    res.status(403).send({"message" : "403 Forbidden"});
                }else{
                    // console.log("Result : ", result);
                    return result;
                }
        }
    )
}

async function comparePassword(enteredPassword, hash){
    return await bcrypt.compare(enteredPassword, hash);
}


exports.getUserInfo = ((req, res) => {
    const inputCheckBool = checkInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "Invalid Id in the request"});
    }else{
        const credentials = checkAuthHeaders(req, res);
        if(isObjEmpty(credentials)){
            res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
        }else{
            console.log("Hitting DB to get the record of the input id");
            const recordFromDB = getSingleUserRecord(req, res, credentials.username)
            recordFromDB.then(result =>{
                const passCompare = comparePassword(credentials.password, result.dataValues.password);
                passCompare.then( cmpResult => {
                    if(cmpResult){
                        res.status(200).send({
                            "id" : result.getDataValue("id"),
                            "first_name" : result.getDataValue("firstName"),
                            "last_name" : result.getDataValue("lastName"),
                            "username" : result.getDataValue("userName"),
                            "account_created" : result.getDataValue("account_created"),
                            "account_updated" : result.getDataValue("account_updated")
                        });
                    }
                    else{
                        res.status(401).send({"message" : "401 Unauthorized"});
                    }
                })
                .catch( error => {
                    res.status(401).send({"message" : "401 Unauthorized", error});
                })
            })
        }
    }
});

exports.putUserInfo = ((req, res) =>{

});

exports.postUserInfo = ((req, res) =>{
    
});