const AWS = require('aws-sdk');
const multer = require('multer');
const uuid = require('uuid');
const Image = require('../models/Image');

const s3 = new AWS.S3();

class ImageService{

    constructor(){
        this.bucketName = process.env.S3_BUCKET_NAME;
        this.s3 = new AWS.S3();
        this.upload = multer({
            storage: multer.memoryStorage(),
            // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
            fileFilter: (req, file, callback) => {
              if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
              }
              callback(null, true);
            },
        }).single('image');
    }

    async uploadImage(req, res, next) {
        try {
          await new Promise((resolve, reject) => {
            this.upload(req, res, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
    
          const file = req.file;
          if (!file) {
            throw new Error('No file uploaded!');
          }
    
          const params = {
            Bucket: this.bucketName,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
          };
    
          const result = await this.s3.upload(params).promise();
          res.send(`File uploaded successfully: ${result.Location}`);
        } catch (err) {
          next(err);
        }
      }
    
}


module.exports = ImageService;