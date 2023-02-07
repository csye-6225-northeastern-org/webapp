const {sequelize, DataTypes } = require("../postgres/db");

const Product = sequelize.define('product', {

    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: {
        field : 'name',
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        field : 'description',
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        field : 'sku',
        type: DataTypes.STRING,
        allowNull : false
    },
    manufacturer : {
        field : 'manufacturer',
        type: DataTypes.STRING,
        allowNull : false
    },
    quantity : {
        field : 'quantity',
        type: DataTypes.INTEGER,
        allowNull : false,
        validate: {
            max: 100,
            min: 0
        }
    },

    date_added : {
        type: DataTypes.DATE,
        field: 'date_added'
    },

    date_last_updated : {
        type: DataTypes.DATE,
        field: 'date_last_updated'
    },

    owner_user_id : {
        type: DataTypes.INTEGER,
        allowNull : false
    }

  }, {
    timestamps : false,
    createdAt: 'false',
    updatedAt: 'false'
});

module.exports = Product;
  