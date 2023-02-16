const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const validateParams = require("../middleware/validationMiddleware");


const usersController = require("../controllers/users");

router.get("/:id", [authMiddleware], usersController.getUserInfo);

router.put("/:id", usersController.putUserInfo);

router.post("", usersController.postUserInfo);

module.exports = router;
