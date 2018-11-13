'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'imageUrl', Sequelize.STRING),
    queryInterface.addColumn('Bets', 'responded', { defaultValue: false, type: Sequelize.BOOLEAN }),
    queryInterface.addColumn('Bets', 'accepted', { defaultValue: false, type: Sequelize.BOOLEAN }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Teams', 'imageUrl'),
    queryInterface.removeColumn('Bets', 'responded'),
    queryInterface.removeColumn('Bets', 'accepted'),
  ]),
};
