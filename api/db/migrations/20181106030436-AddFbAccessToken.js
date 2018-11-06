'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'fbAccessToken', { type: Sequelize.STRING(256), allowNull: true }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'fbAccessToken'),
};
