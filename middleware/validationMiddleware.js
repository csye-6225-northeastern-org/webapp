const UserService = require("../services/userService");
const ProductService = require("../services/productService");
const validationUtil = require("../utils/validations")

exports.validateParams = ((req, res, next)  =>  {
    let userService =  new UserService();
    const id = req.params.id;
    console.log("********** Validation of id in param : ", !validationUtil.validateId(id));
    if(!validationUtil.validateId(id)){
        return res.status(400).send({ "message" : '400 Bad Request' });
    }else{
        userService.findOneById(id)
        .then(userRow =>{
            if(!userRow){
                return res.status(400).send({ "message" : '400 Bad Request' });
            }else{
                next();
            }
        })
    }
});


exports.validateBodyPostUser = ((req, res, next) => {
    let userService =  new UserService();
    const {first_name, last_name, password, username, account_created, account_updated} = req.body;
    if(account_created || account_updated){
        res.status(400).send({"message" : "400 Bad Request. Cannot send account_created / account_updated "});
    }else{
        if(first_name && last_name && password && username){
            userService.findOneByUsername(username)
            .then(record => {
                if(record || !validationUtil.validateEmail(username) || validationUtil.checkEmptyInput(first_name) ||
                        validationUtil.checkEmptyInput(last_name) || validationUtil.checkEmptyInput(password)){
                    res.status(400).send({"message" : "400 Bad Request. Invalid payload"});  
                }else{
                    next();
                }
            })

        }else{
            res.status(400).send({"message" : "400 Bad Request. Not all fields are set"})
        }
    }  
});

exports.validateBodyPutUser = ( (req, res, next) => {
    this.validateParams(req, res, next);
    console.log("********####### Inside ValidateBody PUT after validate Params ********####### ")
    const {password, username, account_created, account_updated} = req.body;

    if(username || account_created || account_updated){
        res.status(400).send({"message" : "400 Bad Request. Cannot update username / account_created / account_updated "});
    }else if(validationUtil.checkEmptyInput(password)){
        res.status(400).send({"message" : "400 Bad Request. Empty password sent"});
    }else{
        next();
    }
});

exports.validateDeleteProduct = ((req, res, next) => {
    let productService = new ProductService();
    this.validateParams(req, res, next);
    console.log(" ********###### Inside validate Delete ********##### ");
    const id = req.params.id;
    productService.findOne(id)
    .then(productRow=>{
        if(!productRow){
            res.status(404).send({"message" : "404 Not Found"});
        }else if(productRow.dataValues.owner_user_id !==  userIdAccessing){
            res.status(403).send({"message" : "403 Forbidden - Not allowed to delete"});
        }else{
            // req.prodDetails = productRow
            next();
        }
    })
});

exports.validatePostProductInfo = ((req, res, next) => {
    const invalidRequestBody = JSON.stringify(req.body)==="{}";
    const {name, description, sku, manufacturer, quantity, date_added, date_last_updated, owner_user_id} = req.body;
    if(!name || !description || !sku || !manufacturer || !quantity){
        res.status(400).send({"message" : "400 Bad Request. Not all mandatory fields are passed "});
    }else if(date_added || date_last_updated || owner_user_id){
        res.status(400).send({"message" : "400 Bad Request. Cannot send date_added / date_last_updated /owner_user_id"});
    }else if(invalidRequestBody){
        res.status(400).send({"message" : "400 Bad Request. Empty payload sent"});
    }
    else if(!name || !description || !sku || !manufacturer || !quantity){
        res.status(400).send({"message" : "400 Bad Request. Invalid Data sent in name/description/manufacturer/sku/quantity"})
    }
    else if(!validationUtil.validateQuantity(quantity)){
        res.status(400).send({"message" : "400 Bad Request. Invalid Quantity Sent in the payload"});
    }else{
        next();
    }
});

exports.validateUpdateProduct = ((req, res, next) =>{
    
});