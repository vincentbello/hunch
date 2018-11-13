'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'xmlStatsId', Sequelize.STRING),
    queryInterface.addColumn('Games', 'xmlStatsId', Sequelize.STRING),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Teams', 'xmlStatsId'),
    queryInterface.removeColumn('Games', 'xmlStatsId'),
  ]),
};
