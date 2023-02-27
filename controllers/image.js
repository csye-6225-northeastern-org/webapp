const ProductService = require('../services/productService');
const ImageService = require('../services/imageService');
const Image = require('../models/Image');

let productService = new ProductService(); 


exports.uploadProductImage = ((req, res) => {
    console.log("Inside upload Product Image API ");
    const file_name = req.params.file;
    const product_id = req.params.product_id;
    ImageService.uploadProductImage();

    res.send(201).send({});
});

exports.getAllProductImages = ((req, res) => {
    res.send(200).send({});
});

exports.getProductImage = ((req, res) => {
    res.send(200).send({});
});

exports.deleteProductImage = ((req, res) => {
    res.send(204).send({});
});