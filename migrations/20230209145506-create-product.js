'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {

      id: { 
          type: Sequelize.INTEGER, 
          primaryKey: true, 
          autoIncrement: true 
      },
      name: {
          field : 'name',
          type: Sequelize.STRING,
          allowNull: false
      },
      description: {
          field : 'description',
          type: Sequelize.STRING,
          allowNull: false
      },
      sku: {
          field : 'sku',
          type: Sequelize.STRING,
          allowNull : false
      },
      manufacturer : {
          field : 'manufacturer',
          type: Sequelize.STRING,
          allowNull : false
      },
      quantity : {
          field : 'quantity',
          type: Sequelize.INTEGER,
          allowNull : false,
          validate: {
              max: 100,
              min: 0
          }
      },
  
      date_added : {
          type: Sequelize.DATE,
          field: 'date_added'
      },
  
      date_last_updated : {
          type: Sequelize.DATE,
          field: 'date_last_updated'
      },
  
      owner_user_id : {
          type: Sequelize.INTEGER,
          allowNull : false
      }
  
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};