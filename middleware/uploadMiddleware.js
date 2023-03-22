const multer = require("multer");
const path = require("path");
const logger = require("../utils/logger");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      const uniqueId = Date.now();
      const appendedName = uniqueId + "_" + file.originalname;
      logger.info("%%%%%%%%%% Appended Name : ", appendedName); 
      cb(null, uniqueId + "_" + file.originalname);
    } else {
      cb(new Error("400 - Cannot upload this file"), false);
    }
  },
});

const upload = (req, res, next) => {
  const multerUpload = multer({ storage: storage }).single("image");
  multerUpload(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      next();
    }
  });
};

module.exports = upload;
