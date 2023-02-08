const { Sequelize, DataTypes} = require('sequelize');
const { dbName,
        hostUrl, 
        userName,
        password,
        nodeEnv,
        dbPoolConfig} = require("./config")

const sequelize = new Sequelize(dbName, userName, password, 
        {
            host: hostUrl,
            dialect: "postgres",
            pool : dbPoolConfig
        });


if(nodeEnv === 'development'){
    (
        async() => {
            await sequelize.sync({ force: true });    
        }
    )();
}


module.exports = {
    sequelize,
    DataTypes
};

  