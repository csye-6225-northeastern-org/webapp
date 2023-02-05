const { Sequelize, DataTypes} = require('sequelize');
const { dbName,
        hostUrl, 
        userName,
        password,
        dbPoolConfig} = require("./config")

const sequelize = new Sequelize(dbName, userName, password, 
        {
            host: hostUrl,
            dialect: "postgres",
            pool : dbPoolConfig
        });

module.exports = {
    sequelize,
    DataTypes
};

  