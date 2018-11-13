'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'site', Sequelize.STRING),
    queryInterface.addColumn('Teams', 'city', Sequelize.STRING),
    queryInterface.addColumn('Teams', 'state', Sequelize.STRING),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Teams', 'site'),
    queryInterface.removeColumn('Teams', 'city'),
    queryInterface.removeColumn('Teams', 'state'),
  ]),
};
