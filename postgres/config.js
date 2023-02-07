require('dotenv').config();

const dbPoolConfig = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
};


module.exports = {
    dialect : process.env.DIALECT,
    dbName : process.env.DB_NAME,
    hostUrl : process.env.HOST,
    userName : process.env.USERNAME,
    password : process.env.PASSWORD,
    nodeEnv : process.env.NODE_ENV,
    dbPoolConfig
}