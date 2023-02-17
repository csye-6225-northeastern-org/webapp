const UserService = require("../services/userService");
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
})

// function validateData(req, res, next){

//     const validationRules = [

//     ]

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         return next();
//     }

//     return res.status(400).json({ errors: errors.array() });
// }

// module.exports = validateParams;
