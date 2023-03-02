const UserService = require("../services/userService");
const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
const validationUtil = require("../utils/validations");

exports.validateParams = (req, res, next) => {
  let userService = new UserService();
  const id = req.params.id;
  console.log(
    "********** Validation of id in param : ",
    !validationUtil.validateId(id)
  );
  if (!validationUtil.validateId(id)) {
    res.status(400).send({ message: "400 Bad Request" });
  } else {
    userService.findOneById(id).then((userRow) => {
      if (!userRow) {
        res.status(400).send({ message: "400 Bad Request - Invalid Id In Params" });
      } else {
        next();
      }
    });
  }
};

exports.validateBodyPostUser = (req, res, next) => {
  let userService = new UserService();
  const {
    first_name,
    last_name,
    password,
    username,
    account_created,
    account_updated,
  } = req.body;
  if (account_created || account_updated) {
    res.status(400).send({
      message:
        "400 Bad Request. Cannot send account_created / account_updated ",
    });
  } else {
    if (first_name && last_name && password && username) {
      userService.findOneByUsername(username).then((record) => {
        if (
          record ||
          !validationUtil.validateEmail(username) ||
          validationUtil.checkEmptyInput(first_name) ||
          validationUtil.checkEmptyInput(last_name) ||
          validationUtil.checkEmptyInput(password)
        ) {
          res.status(400).send({ message: "400 Bad Request. Invalid payload" });
        } else {
          next();
        }
      });
    } else {
      res
        .status(400)
        .send({ message: "400 Bad Request. Not all fields are set" });
    }
  }
};

exports.validateBodyPutUser = (req, res, next) => {
  let userService = new UserService();
  const id = req.params.id;
  if (!validationUtil.validateId(id)) {
    res.status(400).send({ message: "400 Bad Request" });
  }
  else {
    userService.findOneById(id).then((userRow) => {
      if (!userRow) {
        res.status(400).send({ message: "400 Bad Request - Invalid Id In Params" });
      } else {
        console.log(
          "********####### Inside ValidateBody PUT after validate Params ********####### "
        );
        const { password, username, account_created, account_updated } = req.body;
      
        if (username || account_created || account_updated) {
          res.status(400).send({
            message:
              "400 Bad Request. Cannot update username / account_created / account_updated ",
          });
          return;
      
        } else if (validationUtil.checkEmptyInput(password)) {
          res.status(400).send({ message: "400 Bad Request. Empty password sent" });
          return;
      
        } else {
          next();
        }
      }
    });
  }
};

exports.validateDeleteProduct = (req, res, next) => {
  let userService = new UserService();
  const id = req.params.id;
  let productService = new ProductService();
  if (!validationUtil.validateId(id)) {
    res.status(400).send({ message: "400 Bad Request" });
  }else {
    userService.findOneById(id).then((userRow) => {
      if (!userRow) {
        res.status(400).send({ message: "400 Bad Request - Invalid Id In Params" });
      } else {
        console.log(" ********###### Inside validate Delete ********##### ");
  
        productService.findOne(id).then((productRow) => {
          if (!productRow) {
            res.status(404).send({ message: "404 Not Found" });
          } else if (productRow.dataValues.owner_user_id !== userIdAccessing) {
            res
              .status(403)
              .send({ message: "403 Forbidden - Not allowed to delete" });
          } else {
            // req.prodDetails = productRow
            next();
          }
        });
        
      }
    });
  }
};

exports.validatePostProductInfo = (req, res, next) => {
  const invalidRequestBody = JSON.stringify(req.body) === "{}";
  const {
    name,
    description,
    sku,
    manufacturer,
    quantity,
    date_added,
    date_last_updated,
    owner_user_id,
  } = req.body;
  if (!name || !description || !sku || !manufacturer || !quantity) {
    res.status(400).send({
      message: "400 Bad Request. Not all mandatory fields are passed ",
    });
  } else if (date_added || date_last_updated || owner_user_id) {
    res.status(400).send({
      message:
        "400 Bad Request. Cannot send date_added / date_last_updated /owner_user_id",
    });
  } else if (invalidRequestBody) {
    res.status(400).send({ message: "400 Bad Request. Empty payload sent" });
  } else if (!name || !description || !sku || !manufacturer || !quantity) {
    res.status(400).send({
      message:
        "400 Bad Request. Invalid Data sent in name/description/manufacturer/sku/quantity",
    });
  } else if (!validationUtil.validateQuantity(quantity)) {
    res.status(400).send({
      message: "400 Bad Request. Invalid Quantity Sent in the payload",
    });
  } else {
    next();
  }
};

exports.validatePatchProduct = (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    sku,
    manufacturer,
    quantity,
    date_added,
    date_last_updated,
    owner_user_id,
  } = req.body;
  // const inputCheckBool = checkIdInput(req, res);
  const invalidRequestBody = JSON.stringify(req.body) === "{}";
  let productService = new ProductService();
  if (!validationUtil.validateId(id)) {
    return res.status(400).send({ message: "400 Bad Request" });
  } else if (invalidRequestBody) {
    res.status(400).send({ message: "400 Bad Request - Empty Payload Sent" });
  } else if (date_added || date_last_updated || owner_user_id) {
    res.status(400).send({
      message:
        "400 Bad Request - Cannot send date_added / date_last_updated /owner_user_id",
    });
  } else if (!validationUtil.validInputsForProductForPatch(req.body)) {
    res
      .status(400)
      .send({ message: "400 Bad Request - Invalid Input in payload" });
  } else if (!validationUtil.validateQuantity(quantity)) {
    res.status(400).send({
      message: "400 Bad Request - Invalid Quantity Sent in the payload",
    });
  } else {
    productService.findOne(id).then((productRow) => {
      if (!productRow) {
        res.status(400).send({ message: "400 Bad Request" });
      } else {
        req.prodInfo = productRow;
        next();
      }
    });
  }
};

exports.validatePutProduct = (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    sku,
    manufacturer,
    quantity,
    date_added,
    date_last_updated,
    owner_user_id,
  } = req.body;
  // const inputCheckBool = checkIdInput(req, res);
  const invalidRequestBody = JSON.stringify(req.body) === "{}";
  let productService = new ProductService();
  if (!validationUtil.validateId(id)) {
    return res.status(400).send({ message: "400 Bad Request" });
  } else if (invalidRequestBody) {
    res.status(400).send({ message: "400 Bad Request - Empty Payload Sent" });
  } else if (date_added || date_last_updated || owner_user_id) {
    res.status(400).send({
      message:
        "400 Bad Request - Cannot send date_added / date_last_updated /owner_user_id",
    });
  } else if (!name || !description || !sku || !manufacturer || !quantity) {
    res.status(400).send({
      message: "400 Bad Request - All the mandatory fields need to be set",
    });
  } else if (!validationUtil.validateQuantity(quantity)) {
    res.status(400).send({
      message: "400 Bad Request - Invalid Quantity Sent in the payload",
    });
  } else {
    productService.findOne(id).then((productRow) => {
      if (!productRow) {
        res.status(400).send({ message: "400 Bad Request" });
      } else {
        req.prodInfo = productRow;
        next();
      }
    });
  }
};

exports.validateProductImageUpload = (req, res, next) => {
  console.log("Inside validating product-id entered in the URI");
  //   const invalidRequestBody = JSON.stringify(req.body) === "{}";
  const { product_id } = req.params;
  let productService = new ProductService();
  if (!validationUtil.validateId(product_id)) {
    return res.status(400).send({ message: "400 Bad Request" });
  } else {
    productService.findOne(product_id).then((productRow) => {
      console.log(
        "Product Row inside validate Product Image Upload : ",
        productRow
      );
      if (!productRow) {
        res.status(400).send({ message: "400 Product Not Found" });
      } else {
        req.prodInfo = productRow;
        next();
      }
    });
  }
};

exports.validateDeleteImageUpload = (req, res, next) => {
  console.log("Inside Delete validation method for Image Upload");
  const { product_id } = req.params;
  const { image_id } = req.params;
  let productService = new ProductService();
  let imageService = new ImageService();
  if (!validationUtil.validateId(product_id)) {
    return res.status(400).send({ message: "400 Bad Request" });
  } else {
    productService.findOne(product_id).then((productRow) => {
      if (!productRow) {
        res.status(404).send({ message: "404 Product Not Found" });
      } else {
        imageService
          .checkIfImageExists(image_id, product_id)
          .then((imageRow) => {
            if (!imageRow) {
              res.status(404).send({ message: "404 Image Not Found" });
            } else {
              next();
            }
          })
          .catch((err) => {
            res.status(400).send({ message: "400 Bad Request" });
          });
      }
    });
  }
};
