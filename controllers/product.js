const product = require('../models/products');
const validations = require('../utils/validations');
const ProductService = require('../services/productService');

let productService = new ProductService(); 

exports.getProductInfo = ((req, res) => {

});

exports.postProductInfo = ((req, res) => {
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request. Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(validations.validateQuantity(quantity)){
        res.status(400).send({"message" : "400 Bad Request. Invalid Quantity Sent in the payload"});
    }else{
        
    }

    // productService
});

exports.updateProductInfo = ((req, res) => {

});

exports.deleteProductInfo = ((req, res) => {

});