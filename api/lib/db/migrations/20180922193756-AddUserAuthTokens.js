'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'accessToken', Sequelize.STRING),
    queryInterface.addColumn('Users', 'refreshToken', Sequelize.STRING),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Users', 'accessToken'),
    queryInterface.removeColumn('Users', 'refreshToken'),
  ]),
};
