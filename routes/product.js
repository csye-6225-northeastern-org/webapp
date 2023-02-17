const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const productController = require("../controllers/product");

router.get("/:id", [validationMiddleware.validateParams], productController.getProductInfo);

router.put("/:id", productController.putProductInfo);

router.patch("/:id", productController.patchProductInfo);

router.post("", productController.postProductInfo);

router.delete("/:id", [validationMiddleware.validateParams, authMiddleware],
                     productController.deleteProductInfo);

module.exports = router;
