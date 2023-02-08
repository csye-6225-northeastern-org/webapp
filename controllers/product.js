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

exports.getProductInfo = ((req, res) => {

});

exports.postProductInfo = ((req, res) => {
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request. Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(validations.validateQuantity(quantity)){
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

exports.updateProductInfo = ((req, res) => {

});

exports.deleteProductInfo = ((req, res) => {

});