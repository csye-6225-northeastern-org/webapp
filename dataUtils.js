const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('csye6225', 'dev', 'nithin', {
    host: '127.0.0.1',
    dialect: 'postgres'
});

// async function Connection(){
//     const connect = await sequelize.authenticate();
//     console.log("Connect inside async function", connect);
//     return connect;
// } 

// Connection().then(result =>{
//     console.log("Result from connection : ", result);
// })
// .then( () => console.log("Connection successful"))
// .catch( () => console.log("Connection unsuccessful"))

module.exports = {
    sequelize,
    DataTypes
};

  