const {sequelize, DataTypes } = require("../postgres/db");

const User = sequelize.define('users', {
    
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
        type: DataTypes.NOW
    },

    account_updated : {
        type: DataTypes.NOW
    }

  }, {
    timestamps : false
});

module.exports = User;
  