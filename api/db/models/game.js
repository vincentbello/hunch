'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    league: DataTypes.ENUM('NBA'),
    season: DataTypes.INTEGER,
    seasonType: DataTypes.ENUM('PRE', 'REGULAR', 'POST'),
    completed: DataTypes.BOOLEAN,
    homeScore: DataTypes.INTEGER,
    awayScore: DataTypes.INTEGER,
    week: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    homeTeamId: {
      type: DataTypes.INTEGER,
      references: { model: 'Team', key: 'id' }
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      references: { model: 'Team', key: 'id' }
    },
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};
