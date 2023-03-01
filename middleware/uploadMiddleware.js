const multer = require("multer");

const upload = multer({ dest: "uploads/" }).single("image");

module.exports = upload;
