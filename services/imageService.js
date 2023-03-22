require("dotenv").config;
const AWS = require("aws-sdk");
const fs = require("fs");
const Image = require("../models/Image");
const logger = require("../utils/logger");

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

  async deleteFile(image_id, product_id) {
    let file_name = "";
    try {
      const file_name_data = await Image.findOne({
        where: { image_id, product_id },
      });
      file_name = file_name_data.getDataValue("file_name");
    } catch (err) {
      return err;
    }
    logger.info(`****** File name to delete :  ${file_name} *******`);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file_name,
    };

    return this.s3.deleteObject(params).promise();
  }

  async deleteObjectItem(item) {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: item.getDataValue("file_name"),
      };
      await this.s3.deleteObject(params).promise();
      return { status: 'success', item };
    } catch (err) {
      return { status: 'failure', item, error: err.message };
    }
  }
  
  async deleteAllItems(file_name_data) {
    try {
      const results = await Promise.all(file_name_data.map(item => this.deleteObjectItem(item)));
      return results;
    } catch (err) {
      // Handle unexpected errors here
      console.error('Unexpected error:', err);
      throw err;
    }
  }

  async deleteAllFiles(product_id){
    let file_name_data = []
    try{
      file_name_data = await Image.findAll({
        where: { product_id },
      });
    }catch(err){
      return err;
    }

    if(file_name_data.length ===0){
      return "success";
    }

    return await this.deleteAllItems(file_name_data);
  }


  async getSingleImageInfo(image_id, product_id) {
    return await Image.findAll({ where: { image_id, product_id } });
  }

  async getImagesForProduct(product_id) {
    return await Image.findAll({ where: { product_id } });
  }

  async deleteImageProductInfo(image_id, product_id){
    return await Image.destroy({ where: { image_id, product_id } });
  }

  async checkIfImageExists(image_id, product_id) {
    return await Image.findOne({ where: { image_id, product_id } });
  }

  async checkIfImage(image_id) {
    return await Image.findOne({ where: { image_id } });
  }

}

module.exports = ImageService;
