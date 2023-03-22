const validations = require('../utils/validations');
const utils = require('../utils/utils');
const authUtils = require("../utils/authUtils");
const logger = require('../utils/logger');

const User = require('../models/users');

function checkIdInput(req, res){
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

async function getSingleUserRecord(req, res, username){
    const { id } = req.params;
    return await User.findOne({
        where : { id }
        }).then( result => {return result;}
    )
}

async function getSingleUserRecordByUsername(username){
    return await User.findOne({
        where : { username }
    }).then( result => {
        return result;
    })
}

exports.getUserInfo = ((req, res) => {
    logger.info("Processing GET Request for USER APIs");
    const inputCheckBool = checkIdInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "Invalid Id in the request"});
    }else{
        const result = req.userInfo;           
        res.status(200).send({
            "id" : result.getDataValue("id"),
            "first_name" : result.getDataValue("firstName"),
            "last_name" : result.getDataValue("lastName"),
            "username" : result.getDataValue("userName"),
            "account_created" : result.getDataValue("account_created"),
            "account_updated" : result.getDataValue("account_updated")
        });
    }
});


exports.putUserInfo = ((req, res) =>{
    const {id} = req.params;
    logger.info(`Processing USER-PUT Request for Id : ${id}`);
    const {first_name, last_name, password} = req.body;

    const userFields = { 
        ...(first_name && { firstName : first_name }), 
        ...(last_name && { lastName : last_name }),
        account_updated : new Date()
    };

    if(!password){
        logger.info("PUT payload for UserFields : ", userFields);
        User.update(userFields,{
            where : {id}
        })
        .then( result => {
            logger.info("@@@@@@ Result after updating row : ", result);
            res.status(204).send({}); 
        })
        .catch((error) => {
            logger.info("&&&&&& error : ", error);
            res.status(403).send({"message" : "403 Forbidden - Controller"}) 
        });
    }else{
        authUtils.generateHash(password)
        .then( hash =>{
            User.update({
                    ...userFields,
                    password: hash
                },{
                    where : {id}
            })
            .then( result => {res.status(204).send({}); })
            .catch((error) => {res.status(403).send({"message" : "403 Forbidden - Controller", error}); })
        })
    }    
});

exports.postUserInfo = ((req, res) =>{
    const {first_name, last_name, password, username} = req.body;
    logger.info(`Processing USER-POST Request for username : ${username}`);
    authUtils.generateHash(password)
    .then(hash => {
        User.create({
            firstName: first_name,
            lastName: last_name,
            password: hash,
            userName: username,
            account_created : new Date(),
            account_updated : new Date() 
        }).then( result =>{
                res.status(201).send(
                    {
                        "id" : result.getDataValue("id"),
                        "first_name" : result.getDataValue("firstName"),
                        "last_name" : result.getDataValue("lastName"),
                        "username" : result.getDataValue("userName"),
                        "account_created" : result.getDataValue("account_created"),
                        "account_updated" : result.getDataValue("account_updated")
                }
                );
            })
            .catch((error) => {
                res.status(400).send({"message" : "400 Bad Request", error});
            })
        })
});