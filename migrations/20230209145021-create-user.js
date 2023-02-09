'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users',  {
      id: { 
          type: Sequelize.INTEGER, 
          primaryKey: true, 
          autoIncrement: true 
      },
      firstName: {
          field : 'first_name',
          type: Sequelize.STRING,
          allowNull: false
      },
      lastName: {
          field : 'last_name',
          type: Sequelize.STRING,
          allowNull : false
      },
      password : {
          field : 'password',
          type: Sequelize.STRING,
          allowNull : false
      },
      userName : {
          field : 'username',
          type: Sequelize.STRING,
          allowNull : false
      },
  
      account_created : {
          type: Sequelize.DATE,
          field: 'account_created'
      },
  
      account_updated : {
          type: Sequelize.DATE,
          field: 'account_updated'
      }
  
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};