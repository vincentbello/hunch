'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'fbExpiresAt', Sequelize.DATE),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'fbExpiresAt'),
};
