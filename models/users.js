const {sequelize, DataTypes } = require("../postgres/db");

const User = sequelize.define('users', {

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

    account_created : {
        type: DataTypes.DATE,
        field: 'account_created'
    },

    account_updated : {
        type: DataTypes.DATE,
        field: 'account_updated'
    }

  }, {
    timestamps : false,
    createdAt: 'account_created',
    updatedAt: 'account_updated'
});

module.exports = User;
  