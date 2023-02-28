const ProductService = require('../services/productService');
const ImageService = require('../services/imageService');
const Image = require('../models/Image');

let productService = new ProductService();
let imageService = new ImageService();


exports.uploadProductImage = ((req, res) => {
    console.log("Inside upload Product Image API ");
    const {file, file_type} = req.body;
    const product_id = req.params.product_id;
    // imageService.uploadImage(req, res, next)
    // .then((result) => {
    //     console.log(result); // do something with the result
    //     res.status(201).send({});
    // })
    // .catch((err) => {
    //   console.error(err); // handle the error
    // });
    console.log("File sent in body : ", file);
    console.log("File-type sent in body : ", file_type);
    console.log("product_Id sent in body : ", product_id);
    res.status(201).send({});

});

exports.getAllProductImages = ((req, res) => {
    res.status(200).send({});
});

exports.getProductImage = ((req, res) => {
    res.status(200).send({});
});

exports.deleteProductImage = ((req, res) => {
    res.status(204).send({});
});