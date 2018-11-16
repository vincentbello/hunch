'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: Sequelize.STRING,
    email: Sequelize.STRING,
    lastName: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
    admin: Sequelize.BOOLEAN,
    fbId: Sequelize.STRING,
    fbAccessToken: Sequelize.TEXT,
    imageUrl: Sequelize.STRING,
    gender: Sequelize.STRING,
    lastLoginAt: Sequelize.DATE,
    currentLoginAt: Sequelize.DATE,
    loginCount: Sequelize.INTEGER,
    accessToken: Sequelize.STRING,
    refreshToken: Sequelize.STRING,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
