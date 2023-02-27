const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const Image = require('../models/Image');

const s3 = new AWS.S3();

class ImageService{

    async uploadImage(file, product_id){}
    
}


