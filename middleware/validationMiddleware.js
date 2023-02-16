const { param, body, validationResult } = require('express-validator');
const UserService = require("../services/userService");

function validateParams(req, res, next) {
    let userService =  new UserService();
    const id = req.params.id;
    const validationRules = [
        id.isInt().withMessage('Invalid ID')
      ];
    
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        userService.findOneById(id)
        .then(userRow =>{
            if(!userRow){
                return res.status(404).send({ "message" : 'User not found' });
            }else{
                next();
            }
        })
      }
    
      return res.status(422).json({ errors: errors.array() });
    
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
