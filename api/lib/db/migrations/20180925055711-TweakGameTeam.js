'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'abbreviation', Sequelize.STRING),
    queryInterface.removeColumn('Games', 'endDate'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Teams', 'abbreviation'),
    queryInterface.addColumn('Games', 'endDate', Sequelize.DATE),
  ]),
};
