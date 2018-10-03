'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Bets', 'bettorPickTeamId', {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Bets', 'bettorPickTeamId'),
};
