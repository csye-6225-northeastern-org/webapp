const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/users');
const bcrypt = require("bcrypt");
const validations = require("./utils/validations");

const saltRounds = 10;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.get('/healthz', (req, res) =>{
    res.sendStatus(200);
});


app.get('/v1/user/:id', (req, res) =>{
    const { id } = req.params;
    if(!validations.validateId(id)){
        res.status(400).send({"message" : "400 Bad Request"});
    }else{
        const auth = req.headers.authorization;
        const creds =  Buffer.from(auth.split(" ")[1], 'base64').toString('utf-8').split(":");

        const userData = User.findOne({
            where : { id }
                })
                .then( result => {
                    if(!result){
                        res.status(400).send({"message" : "400 Bad Request"});
                    }else if(result.dataValues.userName !== creds[0]){
                        res.status(403).send({"message" : "403 Forbidden"});
                    }
                    else{
                        bcrypt.compare(creds[1], result.dataValues.password)
                        .then( cmpResult => {
                            if(cmpResult){
                                console.log("Result : ", result.dataValues);
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
                            
                    .catch( error => {
                        res.status(400).send({"message" : "400 Bad Request", error});
                    })
                }
            }
        )
        .catch( error => {
            res.status(400).send({"message" : "400 Bad Request"});
        });
    }    
});

app.post('/v1/user', (req, res)=>{
    const {first_name, last_name, password, username} = req.body;
    // Checking if the username exists
    User.findOne({
        where : { username }
    }).then( result => {
        if(result || !validations.validateEmail(username) || 
                validations.validatePassword(password)){
            res.status(400).send({"message" : "400 Bad Request"});  
        }
        else{
            // If username does not exists, then row is created
            bcrypt.genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(password, salt);
                })
                .then(hash => {
                    User.create({
                        firstName: first_name,
                        lastName: last_name,
                        password: hash,
                        userName: username,
                        account_created : new Date(),
                        account_updated : new Date() 
                    }).then(result => {
                        
                        res.status(201).send(
                            {
                                "id" : result.getDataValue("id"),
                                "first_name" : result.getDataValue("firstName"),
                                "last_name" : result.getDataValue("lastName"),
                                "username" : result.getDataValue("userName"),
                                "account_created" : result.getDataValue("account_created"),
                                "account_updated" : result.getDataValue("account_updated")
                            });
                    }).catch((error) => {
                        res.status(400).send({"message" : "400 Bad Request", error});
                    });
                })
                .catch(err => {
                    res.status(400).send({"message" : "400 Bad Request", err});
                })
        }

    })
    
});


app.put('/v1/user/:id', (req, res) =>{
    const { id } = req.params;
    if(!validations.validateId(id) || validations.validatePassword(password)){
        res.status(400).send({"message" : "400 Bad Request"});
    }else{
        const {first_name, last_name, password, username, account_created, account_updated} = req.body;
        
        if(username || account_created || account_updated){
            res.status(400).send({"message" : "400 Bad Request"});
        }

        const auth = req.headers.authorization;
        const credentials =  Buffer.from(auth.split(" ")[1], 'base64').toString('utf-8').split(":");

        const userData = User.findOne({
            where : { id }
        }).then(result => {
            
            if(!result){
                res.status(400).send({"message" : "400 Bad Request"});
            }else if(result.dataValues.userName !== credentials[0]){
                res.status(403).send({"message" : "403 Forbidden"});
            }else{
                bcrypt.compare(credentials[1], result.dataValues.password)
                .then(cmpResult => {
                    console.log("Compare Result in PUT from bcrypt : ", cmpResult);
                    if(cmpResult){
                        bcrypt.genSalt(saltRounds)
                            .then(salt => {
                                return bcrypt.hash(password, salt);
                            })
                            .then(hash =>{
                                User.update({
                                    firstName: first_name,
                                    lastName: last_name,
                                    password: hash,
                                    account_updated : new Date()
                                },
                                {where : {id}})
                                    .then( result => {
                                        res.status(204).send({});
                                    })
                                    .catch((error) => {
                                        res.status(403).send({"message" : "403 Forbidden"});
                                    })
                            })
                        
                    }else{
                        res.status(401).send({"message" : "401 Unauthorized"});
                    }
                })
            }
        }).catch(error => {
            res.status(400).send({"message" : "400 Bad Request"});
        })
    }
});

module.exports = app;