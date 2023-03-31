const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const statsMiddleware = require('../middleware/statsdMiddleware');



const usersController = require("../controllers/users");

router.get("/:id", [validationMiddleware.validateParams, authMiddleware, statsMiddleware], usersController.getUserInfo);

router.put("/:id", [validationMiddleware.validateBodyPutUser, authMiddleware, statsMiddleware], usersController.putUserInfo);

router.post("", [validationMiddleware.validateBodyPostUser, statsMiddleware], usersController.postUserInfo);

module.exports = router;
