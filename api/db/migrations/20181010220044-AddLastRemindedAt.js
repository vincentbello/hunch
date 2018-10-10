'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Bets', 'lastRemindedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Bets', 'lastRemindedAt'),
};
