const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "uploads");
  // },
  filename: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, Date.now() + path.extname(file.originalname));
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
