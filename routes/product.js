const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const statsMiddleware = require('../middleware/statsdMiddleware');

const productController = require("../controllers/product");

const productImageController = require("../controllers/image");

router.get(
  "/:id",
  [validationMiddleware.validateProductParams, statsMiddleware],
  productController.getProductInfo
);

router.put(
  "/:id",
  [validationMiddleware.validatePutProduct, authMiddleware, statsMiddleware],
  productController.putProductInfo
);

router.patch(
  "/:id",
  [validationMiddleware.validatePatchProduct, authMiddleware, statsMiddleware],
  productController.patchProductInfo
);

router.post(
  "",
  [validationMiddleware.validatePostProductInfo, authMiddleware, statsMiddleware],
  productController.postProductInfo
);

router.delete(
  "/:id",
  [validationMiddleware.validateDeleteProduct, authMiddleware, statsMiddleware],
  productController.deleteProductInfo
);

router.get(
  "/:product_id/image",
  [validationMiddleware.validateProductImageUpload, authMiddleware, statsMiddleware],
  productImageController.getAllProductImages
);

router.get(
  "/:product_id/image/:image_id",
  [validationMiddleware.validateDeleteImageUpload, authMiddleware, statsMiddleware],
  productImageController.getProductImage
);

router.post(
  "/:product_id/image",
  [
    validationMiddleware.validateProductImageUpload,
    authMiddleware,
    statsMiddleware,
    uploadMiddleware,
  ],
  productImageController.uploadProductImage
);

router.delete(
  "/:product_id/image/:image_id",
  [validationMiddleware.validateDeleteImageUpload, authMiddleware, statsMiddleware ],
  productImageController.deleteProductImage
);

module.exports = router;
