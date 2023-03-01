require("dotenv").config;
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const uuid = require("uuid");
const Image = require("../models/Image");

class ImageService {
  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  async uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return this.s3.upload(uploadParams).promise();
  }

  async insertImageInfoToDB(imageInfo) {
    return await Image.create(imageInfo);
  }
}

module.exports = ImageService;
