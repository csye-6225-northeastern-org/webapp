const { Sequelize, DataTypes} = require('sequelize');
const { dbName,
        hostUrl, 
        userName,
        password} = require("./config")

const sequelize = new Sequelize(dbName, userName, password, {
                                    host: hostUrl,
                                    dialect: "postgres"
                                });

module.exports = {
    sequelize,
    DataTypes
};

  