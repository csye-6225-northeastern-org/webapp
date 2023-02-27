const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");


const imageController = require("../controllers/image");

router.get("/image", [validationMiddleware.validateParams, authMiddleware], imageController.getAllProductImages);

router.get("/image/:image_id", [validationMiddleware.validateParams, authMiddleware], imageController.getProductImage);

router.post("/image", [authMiddleware], imageController.uploadProductImage);

router.delete("/image/:image_id", [authMiddleware], imageController.deleteProductImage);

module.exports = router;
