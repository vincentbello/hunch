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
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    bettorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    betteeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    winnerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  Bet.associate = function(models) {
    Bet.belongsTo(models.Game, { foreignKey: 'gameId' });
    Bet.belongsTo(models.User, { foreignKey: 'bettorId' });
    Bet.belongsTo(models.User, { foreignKey: 'betteeId' });
    Bet.belongsTo(models.User, { foreignKey: 'winnerId' });
  };
  return Bet;
};
