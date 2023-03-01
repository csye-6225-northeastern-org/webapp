const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
const Image = require("../models/Image");

let productService = new ProductService();
let imageService = new ImageService();

exports.uploadProductImage = (req, res, next) => {
  console.log("Inside upload Product Image API ");
  const product_id = req.params.product_id;
  console.log("Inside Upload Product Image API with product-id : ", product_id);
  const description = req.file.description;
  console.log("Description : ", description);
  // imageService.uploadImage(req, res, next);
  // res.status(201).send({});
  const file = req.file;
  console.log("File : ", file);
  res.status(201).send({});
};

exports.getAllProductImages = (req, res) => {
  res.status(200).send({});
};

exports.getProductImage = (req, res) => {
  res.status(200).send({});
};

exports.deleteProductImage = (req, res) => {
  res.status(204).send({});
};
