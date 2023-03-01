const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
// const Image = require("../models/Image");

let productService = new ProductService();
let imageService = new ImageService();

exports.uploadProductImage = (req, res, next) => {
  console.log("Inside upload Product Image API ");
  const product_id = req.params.product_id;

  const file = req.file;

  imageService
    .uploadFile(file)
    .then((result) => {
      const dataToInsert = {
        product_id,
        file_name: result.Key,
        date_created: new Date(),
        s3_bucket_path: result.Location,
      };

      imageService
        .insertImageInfoToDB(dataToInsert)
        .then((insertedRow) => {
          res.status(201).send(insertedRow);
        })
        .catch((err) => {
          res.status(400).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
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
