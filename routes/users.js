const express = require('express')
const router = express.Router()

const usersController = require("../controllers/users");

router.get("/:id", usersController.getUserInfo);

router.put("/:id", usersController.putUserInfo);

router.post("", usersController.postUserInfo);

module.exports = router;
