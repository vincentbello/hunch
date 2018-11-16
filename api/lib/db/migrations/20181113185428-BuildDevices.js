'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Devices', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    type: Sequelize.ENUM('ANDROID', 'IOS'),
    token: Sequelize.STRING,
    allowedNotifications: Sequelize.BOOLEAN,
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Devices'),
};
