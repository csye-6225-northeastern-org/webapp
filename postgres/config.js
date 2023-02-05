require('dotenv').config();

module.exports = {
    dialect : process.env.DIALECT,
    dbName : process.env.DB_NAME,
    hostUrl : process.env.HOST,
    userName : process.env.USERNAME,
    password : process.env.PASSWORD
}