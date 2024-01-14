'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrementIdentity: true
      },
      user_uuid: {
        type: Sequelize.UUID
      },
      order_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
      },
      order_total: Sequelize.INTEGER,
      completed: Sequelize.BOOLEAN,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};