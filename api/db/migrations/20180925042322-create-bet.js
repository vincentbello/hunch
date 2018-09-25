'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('MONEY_LINE'),
        defaultValue: 'MONEY_LINE',
      },
      amount: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      wager: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resolvedAt: {
        type: Sequelize.DATE
      },
      gameId: {
        type: Sequelize.INTEGER,
      },
      bettorId: {
        type: Sequelize.INTEGER,
      },
      betteeId: {
        type: Sequelize.INTEGER,
      },
      winnerId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Bets');
  }
};
