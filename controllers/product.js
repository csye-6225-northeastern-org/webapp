const validations = require('../utils/validations');
const ProductService = require('../services/productService');
const ImageService = require("../services/imageService");
const utils = require('../utils/utils');

let productService = new ProductService(); 


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
    productService.findOne(id)
    .then(row =>{
        if(!row){
            res.status(404).send({"message" : "404 - No Product-id found"})
        }else{
            res.status(200).send(row.dataValues);
        }
    })
});


exports.postProductInfo = ((req, res) => {
    const {name, description, sku, manufacturer, quantity} = req.body;
    const result = req.userInfo; 
    productService.findOrCreate(sku, {
            name,
            description,
            sku,
            manufacturer,
            quantity,
            owner_user_id : result.getDataValue("id"),
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
});


exports.putProductInfo = ((req, res) => {
    const { id } = req.params;
    const {name, description, sku, manufacturer, quantity} = req.body;    
    productService.findOneBySku(sku)
    .then(rowFound=>{
        if(rowFound && parseInt(rowFound.dataValues.id) !== parseInt(id)){
        res.status(400).send({"message" : "400 Bad Request - SKU Already exists"})
        }else{
            productService.updateProductInfo({name, description,
                sku, manufacturer, quantity,
                    date_last_updated : new Date()}, id)
                .then( updatedRow => {
                    if(updatedRow){
                        res.status(204).send({});  
                }
            })
        }
    })
        
                          
});


exports.patchProductInfo = ((req, res) => {
    const id = req.params.id;
    console.log("Request Body : ", req.body);
    console.log("Id  : ", id);
    const {name, description, sku, manufacturer, quantity} = req.body;
    const productFields = { 
        ...(name && { name }), 
        ...(description && { description }),
        ...(sku && { sku }),
        ...(manufacturer && { manufacturer }),
        ...(quantity && { quantity }),
        date_last_updated : new Date()
    };

    if(sku){
        productService.findOneBySku(sku)
        .then(rowFound=>{
            if(rowFound && parseInt(rowFound.dataValues.id) !== parseInt(id)){
                res.status(400).send({"message" : "400 Bad Request - SKU Already exists"})
            }else{
                productService.updateProductInfo(productFields, id)
                    .then( updatedRow => {
                        if(updatedRow){
                            res.status(204).send({});  
                    }
                })
            }
        })
    }else{
        productService.updateProductInfo(productFields, id)
            .then( updatedRow => {
                if(updatedRow){
                    res.status(204).send({});  
            }
        })
    }  
    
});


exports.deleteProductInfo = ((req, res) => {
    const { id } = req.params;
    // Need to check if any images exists for the product and delete the rows too!
    const imageService = new ImageService();
    imageService.deleteAllFiles(id)
    .then(results => {
      // Handle results array here if exists
      if(Array.isArray()){
        results.forEach(result => {
            if (result.status === 'failure') {
                res.status(500).send({"message" : "Image deletion failure from S3"});
            } 
          });
      }else if(results === 'fail'){
        res.status(404).send({"message" : "404 Not Found"});
      }

        productService.deleteProductInfo(id)
        .then( deletedRow => {
            if(deletedRow > 0){
                // const imageService = new ImageService();
                // deleteAllFiles()
                res.status(204).send({}); 
            }else{
                res.status(404).send({"message" : "404 Not Found"});
            }
        })
      
    })
});