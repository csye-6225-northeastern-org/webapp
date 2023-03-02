const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const productController = require("../controllers/product");

const productImageController = require("../controllers/image");

router.get(
  "/:id",
  [validationMiddleware.validateParams],
  productController.getProductInfo
);

router.put(
  "/:id",
  [validationMiddleware.validatePutProduct, authMiddleware],
  productController.putProductInfo
);

router.patch(
  "/:id",
  [validationMiddleware.validatePatchProduct, authMiddleware],
  productController.patchProductInfo
);

router.post(
  "",
  [validationMiddleware.validatePostProductInfo, authMiddleware],
  productController.postProductInfo
);

router.delete(
  "/:id",
  [validationMiddleware.validateDeleteProduct, authMiddleware],
  productController.deleteProductInfo
);

router.get(
  "/:product_id/image",
  [validationMiddleware.validateProductImageUpload, authMiddleware],
  productImageController.getAllProductImages
);

router.get(
  "/:product_id/image/:image_id",
  [validationMiddleware.validateDeleteImageUpload, authMiddleware],
  productImageController.getProductImage
);

router.post(
  "/:product_id/image",
  [
    validationMiddleware.validateProductImageUpload,
    authMiddleware,
    uploadMiddleware,
  ],
  productImageController.uploadProductImage
);

router.delete(
  "/:product_id/image/:image_id",
  [validationMiddleware.validateDeleteImageUpload, authMiddleware ],
  productImageController.deleteProductImage
);

module.exports = router;
