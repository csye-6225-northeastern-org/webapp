const express = require('express')
const router = express.Router()

const usersController = require("../controllers/users");

router.get("/:id", usersController.getUserInfo);

module.exports = router;