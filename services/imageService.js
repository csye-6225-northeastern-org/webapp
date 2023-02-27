const AWS = require('aws-sdk');
const uuid = require('uuid');
const Image = require('../models/Image');

const s3 = new AWS.S3();

class ImageService{

    async uploadImage(file, product_id){
        return new Promise((resolve, reject) =>{
            const uniqueId = uuid.v4();
            const key = `${uniqueId}-${file.originalname}`;
            s3.upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
                Body: file.buffer
              }, (err, data) =>{
                if(err){
                    return reject(err);
                }

                Image.create()

              });
          

        })
    }
}


