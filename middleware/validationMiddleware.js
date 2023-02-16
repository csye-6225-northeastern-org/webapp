const { param, body, validationResult } = require('express-validator');
const UserService = require("../services/userService");
const validationUtil = require("../utils/validations")

function validateParams(req, res, next) {
    let userService =  new UserService();
    const id = req.params.id;
    const validationRules = [
        !validationUtil.validateId(param("id"))
      ];
    
    const errors = validationResult(req);
    console.log("Errors is empty : ", errors.isEmpty());
    if (errors.isEmpty()) {
        userService.findOneById(id)
        .then(userRow =>{
            if(!userRow){
                return res.status(400).send({ "message" : '400 Bad Request' });
            }else{
                next();
            }
        })
    }else{
        return res.status(400).send({ errors: errors.array() });
    }
}

function validateData(req, res, next){

    const validationRules = [

    ]

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({ errors: errors.array() });
}

module.exports = validateParams;
