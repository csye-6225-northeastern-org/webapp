const AWS = require("aws-sdk");
const multer = require("multer");
const uuid = require("uuid");
const Image = require("../models/Image");
const upload = multer({ dest: "uploads/" });

class ImageService {
  constructor() {
    this.s3 = new AWS.S3();
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  async uploadImage(req, res, next) {
    try {
      const image = req.file.buffer;
      const filename = req.file.originalname;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: filename,
        Body: image,
        ACL: "public-read", // Make the uploaded file public
        ContentType: req.file.mimetype, // Set the content type of the file
      };

      // Upload the file to S3
      return await this.s3.upload(uploadParams).promise();

      // res.status(200).send({ message: "File uploaded successfully" });
    } catch (error) {
      return error;
      // res.status(500).send({ error: "Failed to upload file" });
    }
  }
}

module.exports = ImageService;
