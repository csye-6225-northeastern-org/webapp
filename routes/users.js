const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");


const usersController = require("../controllers/users");

router.get("/:id", [validationMiddleware.validateParams, authMiddleware], usersController.getUserInfo);

router.put("/:id", [validationMiddleware.validateBodyPutUser, authMiddleware], usersController.putUserInfo);

router.post("", [validationMiddleware.validateBodyPostUser], usersController.postUserInfo);

module.exports = router;
