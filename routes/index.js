const express = require('express')
const statsMiddleware = require('../middleware/statsdMiddleware');
const router = express.Router()

const index_controller = require("../controllers/index");

router.get("/", [statsMiddleware], index_controller.welcome);

router.get("/healthz", [statsMiddleware], index_controller.healthz);

module.exports = router;
