const {sequelize, DataTypes } = require("../postgres/db");

const Product = sequelize.define('product', {

    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: {
        field : 'first_name',
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        field : 'last_name',
        type: DataTypes.STRING,
        allowNull : false
    },
    password : {
        field : 'password',
        type: DataTypes.STRING,
        allowNull : false
    },
    userName : {
        field : 'username',
        type: DataTypes.STRING,
        allowNull : false
    },

    createdAt : {
        type: DataTypes.DATE,
        field: 'account_created'
    },

    updatedAt : {
        type: DataTypes.DATE,
        field: 'account_updated'
    }

  }, {
    timestamps : false,
    createdAt: 'false',
    updatedAt: 'false'
});

module.exports = Product;
  