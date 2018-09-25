'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bet = sequelize.define('Bet', {
    type: {
      allowNull: false,
      type: DataTypes.ENUM('MONEY_LINE'),
      defaultValue: 'MONEY_LINE',
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    wager: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resolvedAt: DataTypes.DATE,
    gameId: {
      type: DataTypes.INTEGER,
      references: { model: 'Game', key: 'id' }
    },
    bettorId: {
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    },
    betteeId: {
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    },
    winnerId: {
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    },
  }, {});
  Bet.associate = function(models) {
    // associations can be defined here
  };
  return Bet;
};
