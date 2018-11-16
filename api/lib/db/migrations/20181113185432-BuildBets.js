'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Bets', {
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
    wager: Sequelize.STRING,
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    responded: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    resolvedAt: Sequelize.DATE,
    lastRemindedAt: Sequelize.DATE,
    gameId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Games',
        key: 'id',
      },
    },
    bettorId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    betteeId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    winnerId: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    bettorPickTeamId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Bets'),
};
