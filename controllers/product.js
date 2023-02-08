const product = require('../models/products');
const validations = require('../utils/validations');
const ProductService = require('../services/productService');
const UserService = require('../services/userService');
const utils = require('../utils/utils');
const authUtils = require("../utils/authUtils");

let productService = new ProductService(); 
let userService = new UserService();

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

function checkIdInput(req, res){
    const { id } = req.params;
    if(!validations.validateId(id)){
        return true;
    }else{
        return false;
    }
}


exports.getProductInfo = ((req, res) => {
    const { id } = req.params;
    const inputCheckBool = checkIdInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "Bad Request-Invalid Id in the request"});
    }else{
        productService.findOne(id)
        .then(row =>{
            if(!row){
                res.status(400).send({"message" : "Bad Request-No Product-id found"})
            }else{
                res.status(200).send(row.dataValues);
            }
        })
    }
});

exports.postProductInfo = ((req, res) => {
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request. Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(!name || !description || !sku || !manufacturer || !quantity){
        res.status(400).send({"message" : "400 Bad Request. Invalid Data sent in name/description/manufacturer/sku/quantity"})
    }
    else if(validations.validateQuantity(quantity)){
        res.status(400).send({"message" : "400 Bad Request. Invalid Quantity Sent in the payload"});
    }else{
        const credentials = checkAuthHeaders(req, res);
        if(utils.isObjEmpty(credentials)){
            res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
        }else if(credentials.username==='' || credentials.password === ''){
            res.status(401).send({"message" : "Unauthorized - Missing username/password"});
        }else{
            userService.findOneByUsername(credentials.username)
                .then( result =>{
                    if(!result){
                        res.status(401).send({"message" : "401 Unauthorized. No user found"});
                    }else if(result.dataValues.userName !== credentials.username){
                        res.status(403).send({"message" : "403 Forbidden"});
                    }else{
                        const passCompare = authUtils.comparePassword(credentials.password, result.dataValues.password);
                        passCompare.then(cmpResult =>{
                            if(cmpResult){
                                // If password is valid, then we check if sku exists. If exists throw 400 - Bad request
                                productService.findOrCreate(sku, {
                                                name,
                                                description,
                                                sku,
                                                manufacturer,
                                                quantity,
                                                owner_user_id : result.dataValues.id,
                                                date_added : new Date(),
                                                date_last_updated : new Date() 
                                            }).then(result => {
                                                const [createdRow, created] = result;
                                                if(created){
                                                    res.status(201).send(createdRow);
                                                }else{
                                                    res.status(400).send({"message" : "400 Bad Request. SKU Already exists"});
                                                }
                                            });
                            }else{
                                res.status(401).send({"message" : "401 Unauthorized"});
                            }
                        })
                    }
            })
        }
    }
});

exports.putProductInfo = ((req, res) => {

    const { id } = req.params;
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    const inputCheckBool = checkIdInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "400 Bad Request - Invalid Id in the request"});
    }else if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request - Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(validations.validateQuantity(quantity)){
        res.status(400).send({"message" : "400 Bad Request - Invalid Quantity Sent in the payload"});
    }else{
        const credentials = checkAuthHeaders(req, res);
        if(utils.isObjEmpty(credentials)){
            res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
        }else if(credentials.username==='' || credentials.password === ''){
            res.status(401).send({"message" : "Unauthorized - Missing username/password"});
        }else{
            userService.findOneByUsername(credentials.username)
            .then( result =>{
                if(!result){
                    res.status(401).send({"message" : "401 Unauthorized. No user found"});
                }else if(result.dataValues.userName !== credentials.username){
                    res.status(403).send({"message" : "403 Forbidden"});
                }else{
                    const passCompare = authUtils.comparePassword(credentials.password, result.dataValues.password);
                    passCompare.then(cmpResult => {
                        if(cmpResult){
                            const userIdAccessing = result.getDataValue("id");
                            if(sku){
                                productService.findOneBySku(sku)
                                .then(rowFound=>{
                                    if(rowFound){
                                        res.status(400).send({"message" : "400 Bad Request - SKU Already exists"})
                                    }else{
                                        productService.findOne(id)
                                        .then(productRow => {
                                            if(!productRow){
                                                res.status(400).send({"message" : "400 Not Found"});
                                            }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
                                                res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
                                            }else{
                                                productService.updateProductInfo({name, description,
                                                            sku, manufacturer, quantity}, id)
                                                .then( updatedRow => {
                                                    if(updatedRow){
                                                        res.status(204).send({});  
                                                    }
                                                })
                                                
                                            }
                                        })
                                    }
                                })
                            }else{
                                productService.findOne(id)
                                    .then(productRow => {
                                        if(!productRow){
                                            res.status(400).send({"message" : "400 Not Found"});
                                        }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
                                            res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
                                        }else{
                                            productService.updateProductInfo({name, description,
                                                        sku, manufacturer, quantity}, id)
                                            .then( updatedRow => {
                                                if(updatedRow){
                                                    res.status(204).send({});  
                                                }
                                            })
                                            
                                        }
                                    })
                            }
                        }else{
                            res.status(401).send({"message" : "401 Unauthorized"});
                        }
                    })
                }
            })
        }
    }

});

exports.patchProductInfo = ((req, res) => {

    const { id } = req.params;
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    const inputCheckBool = checkIdInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "400 Bad Request - Invalid Id in the request"});
    }else if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request - Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(validations.validateQuantity(quantity)){
        res.status(400).send({"message" : "400 Bad Request - Invalid Quantity Sent in the payload"});
    }else{
        const credentials = checkAuthHeaders(req, res);
        if(utils.isObjEmpty(credentials)){
            res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
        }else if(credentials.username==='' || credentials.password === ''){
            res.status(401).send({"message" : "Unauthorized - Missing username/password"});
        }else{
            userService.findOneByUsername(credentials.username)
            .then( result =>{
                if(!result){
                    res.status(401).send({"message" : "401 Unauthorized. No user found"});
                }else if(result.dataValues.userName !== credentials.username){
                    res.status(403).send({"message" : "403 Forbidden"});
                }else{
                    const passCompare = authUtils.comparePassword(credentials.password, result.dataValues.password);
                    passCompare.then(cmpResult => {
                        if(cmpResult){
                            const userIdAccessing = result.getDataValue("id");
                            if(sku){
                                productService.findOneBySku(sku)
                                .then(rowFound=>{
                                    if(rowFound){
                                        res.status(400).send({"message" : "400 Bad Request - SKU Already exists"})
                                    }else{
                                        productService.findOne(id)
                                        .then(productRow => {
                                            if(!productRow){
                                                res.status(400).send({"message" : "400 Not Found"});
                                            }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
                                                res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
                                            }else{
                                                productService.updateProductInfo({name, description,
                                                            sku, manufacturer, quantity}, id)
                                                .then( updatedRow => {
                                                    if(updatedRow){
                                                        res.status(204).send({});  
                                                    }
                                                })
                                                
                                            }
                                        })
                                    }
                                })
                            }else{
                                productService.findOne(id)
                                    .then(productRow => {
                                        if(!productRow){
                                            res.status(400).send({"message" : "400 Not Found"});
                                        }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
                                            res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
                                        }else{
                                            productService.updateProductInfo({name, description,
                                                        sku, manufacturer, quantity}, id)
                                            .then( updatedRow => {
                                                if(updatedRow){
                                                    res.status(204).send({});  
                                                }
                                            })
                                            
                                        }
                                    })
                            }
                        }else{
                            res.status(401).send({"message" : "401 Unauthorized"});
                        }
                    })
                }
            })
        }
    }

});

exports.deleteProductInfo = ((req, res) => {
    const { id } = req.params;
    const inputCheckBool = checkIdInput(req, res);
    if(inputCheckBool){
        res.status(400).send({"message" : "Bad Request-Invalid Id in the request"});
    }else{
        const credentials = checkAuthHeaders(req, res);
        if(utils.isObjEmpty(credentials)){
            res.status(401).send({"message" : "Unauthorized - No Authorization found in headers"});
        }else if(credentials.username==='' || credentials.password === ''){
            res.status(401).send({"message" : "Unauthorized - Missing username/password"});
        }else{
            userService.findOneByUsername(credentials.username)
            .then( result =>{
                if(!result){
                    res.status(401).send({"message" : "401 Unauthorized. No user found"});
                }else if(result.dataValues.userName !== credentials.username){
                    res.status(403).send({"message" : "403 Forbidden"});
                }else{
                    const passCompare = authUtils.comparePassword(credentials.password, result.dataValues.password);
                    passCompare.then(cmpResult => {
                        if(cmpResult){
                            const userIdAccessing = result.getDataValue("id");
                            productService.findOne(id)
                            .then(productRow => {
                                if(!productRow){
                                    res.status(404).send({"message" : "404 Not Found"});
                                }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
                                    res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
                                }else{
                                    productService.deleteProductInfo(id)
                                    .then( deletedRow => {
                                        if(deletedRow > 0){
                                            res.status(204).send({}); 
                                        }else{
                                            res.status(404).send({"message" : "404 Not Found"});
                                        }
                                    })
                                    
                                }
                            }) 
                        }else{
                            res.status(401).send({"message" : "401 Unauthorized"});
                        }
                    })
                }
            })
        }
    }
});