const validations = require('../utils/validations');
const utils = require('../utils/utils');
const authUtils = require("../utils/authUtils");

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

// exports.getUserInfo = ((req, res) => {
//     const inputCheckBool = checkIdInput(req, res);
//     if(inputCheckBool){
//         res.status(400).send({"message" : "Invalid Id in the request"});
//     }else{
//         const credentials = checkAuthHeaders(req, res);
//         if(utils.isObjEmpty(credentials)){
//             res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
//         }else if(credentials.username==='' || credentials.password === ''){
//             res.status(401).send({"message" : "Unauthorized - Missing username/password"});
//         }
//         else{
//             const recordFromDB = getSingleUserRecordByUsername(credentials.username)
//             recordFromDB.then(result =>{
//                 if(!result){
//                     res.status(401).send({"message" : "401 Unauthorized - No Authorization found"});
//                 }else{
//                     // Got a row from DB. Need to check if the same username and password
//                     if(result.dataValues.userName === credentials.username){
//                         authUtils.comparePassword(credentials.password, result.dataValues.password)
//                         .then(passwordCompare =>{
//                             if(passwordCompare){
//                                 if(parseInt(result.dataValues.id) !== parseInt(req.params.id)){
//                                     res.status(403).send({"message" : "403 Forbidden - Id incorrect"});
//                                 }else{
//                                     res.status(200).send({
//                                         "id" : result.getDataValue("id"),
//                                         "first_name" : result.getDataValue("firstName"),
//                                         "last_name" : result.getDataValue("lastName"),
//                                         "username" : result.getDataValue("userName"),
//                                         "account_created" : result.getDataValue("account_created"),
//                                         "account_updated" : result.getDataValue("account_updated")
//                                     });
//                                 }
//                             }else{
//                                 res.status(401).send({"message" : "401 Unauthorized - Invalid Password"});
//                             }
//                         }) 
//                     }
//                     else{
//                         res.status(401).send({"message" : "401 Unauthorized"});
//                     }
//                 }
//             })
//         }
//     }
// });

exports.getUserInfo = ((req, res) => {
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

// exports.putUserInfo = ((req, res) =>{
//     const inputCheckBool = checkIdInput(req, res);
//     const {id} = req.params;
//     if(inputCheckBool){
//         res.status(400).send({"message" : "Invalid Id in the request"});
//     }else{
//         const {first_name, last_name, password, username, account_created, account_updated} = req.body;

//         if(username || account_created || account_updated){
//             res.status(400).send({"message" : "400 Bad Request. Cannot update username / account_created / account_updated "});
//         }else if(validations.checkEmptyInput(password)){
//             res.status(400).send({"message" : "400 Bad Request. Empty password sent"});
//         }
//         else{
//             const credentials = checkAuthHeaders(req, res);
//             if(utils.isObjEmpty(credentials)){
//                 res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
//             }else if(credentials.username==='' || credentials.password === ''){
//                 res.status(401).send({"message" : "Unauthorized - Missing username/password"});
//             }else{
//                 const recordFromDB = getSingleUserRecordByUsername(credentials.username);
//                 recordFromDB.then(result =>{
//                     if(!result){
//                         res.status(401).send({"message" : "401 Unauthorized - No Authorization found"});
//                     }else{
//                         // Got a row from DB. Need to check if the same username and password
//                         if(result.dataValues.userName === credentials.username){
//                             authUtils.comparePassword(credentials.password, result.dataValues.password)
//                             .then( cmpResult => {
//                                 if(cmpResult){
//                                     if(parseInt(result.dataValues.id) !== parseInt(req.params.id)){
//                                         res.status(403).send({"message" : "403 Forbidden"});
//                                     }else{
//                                         authUtils.generateHash(credentials.password)
//                                         .then( hash =>{
//                                             User.update({
//                                                     firstName: first_name,
//                                                     lastName: last_name,
//                                                     password: hash,
//                                                     account_updated : new Date()
//                                                 },{
//                                                     where : {id}
//                                             })
//                                             .then( result => {res.status(204).send({}); })
//                                             .catch((error) => {res.status(403).send({"message" : "403 Forbidden"}); })
//                                         })
//                                     }    
//                                 }
//                                 else{
//                                     res.status(401).send({"message" : "401 Unauthorized"});
//                                 }
//                             })
//                             .catch( error => {
//                                 res.status(401).send({"message" : "401 Unauthorized", error});
//                             })
//                         }else{
//                             res.status(401).send({"message" : "401 Unauthorized"});
//                         }
//                     }
                    
//                 })
//             }
//         }
//     }
// });

exports.putUserInfo = ((req, res) =>{
    const {id} = req.params;
    const {first_name, last_name, password} = req.body;

    const userFields = { 
        ...(first_name && { firstName : first_name }), 
        ...(last_name && { lastName : last_name }),
        account_updated : new Date()
    };

    if(!password){
        console.log("PUT payload for UserFields : ", userFields);
        User.update(userFields,{
            where : {id}
        })
        .then( result => {
            console.log("@@@@@@ Result after updating row : ", result);
            res.status(204).send({}); 
        })
        .catch((error) => {
            console.log("&&&&&& error : ", error);
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

// exports.postUserInfo = ((req, res) =>{
//     const {first_name, last_name, password, username, account_created, account_updated} = req.body;
//     if(account_created || account_updated){
//         res.status(400).send({"message" : "400 Bad Request. Cannot send account_created / account_updated "});
//     }else{
//         const userRecord = getSingleUserRecordByUsername(username);
//         userRecord.then(record => {
//             if(record || !validations.validateEmail(username) || validations.checkEmptyInput(first_name) ||
//             validations.checkEmptyInput(last_name) || validations.checkEmptyInput(password)){
//                 res.status(400).send({"message" : "400 Bad Request. Invalid payload"});  
//             }else{
//                 authUtils.generateHash(password)
//                 .then(hash => {
//                     User.create({
//                         firstName: first_name,
//                         lastName: last_name,
//                         password: hash,
//                         userName: username,
//                         account_created : new Date(),
//                         account_updated : new Date() 
//                     }).then( result =>{
//                         // console.log("Result : ", result);
//                         res.status(201).send(
//                             {
//                                 "id" : result.getDataValue("id"),
//                                 "first_name" : result.getDataValue("firstName"),
//                                 "last_name" : result.getDataValue("lastName"),
//                                 "username" : result.getDataValue("userName"),
//                                 "account_created" : result.getDataValue("account_created"),
//                                 "account_updated" : result.getDataValue("account_updated")
//                         });
//                     })
//                     .catch((error) => {
//                         res.status(400).send({"message" : "400 Bad Request", error});
//                     })
//                 })
//             }
//         })
//     }
// });

exports.postUserInfo = ((req, res) =>{
    const {first_name, last_name, password, username} = req.body;
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