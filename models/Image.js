const {sequelize, DataTypes } = require("../postgres/db");

const Image = sequelize.define('images', {

    image_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    product_id: {
        field : 'product_id',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_name: {
        field : 'file_name',
        type: DataTypes.STRING,
        allowNull : false
    },
    s3_bucket_path : {
        field : 's3_bucket_path',
        type: DataTypes.STRING,
        allowNull : false
    },

    date_created : {
        type: DataTypes.DATE,
        field: 'date_created'
    }
  }, {
    timestamps : false,
    createdAt: 'date_created'
});

module.exports = Image;
  