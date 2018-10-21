'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'msfId', Sequelize.INTEGER),
    queryInterface.addColumn('Games', 'msfId', Sequelize.INTEGER),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Teams', 'msfId'),
    queryInterface.removeColumn('Games', 'msfId'),
  ]),
};
