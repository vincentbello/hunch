'use strict';
import Team from './team';

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
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    awayTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  Game.associate = function(models) {
    Game.belongsTo(models.Team, { foreignKey: 'homeTeamId' });
    Game.belongsTo(models.Team, { foreignKey: 'awayTeamId' });
  };
  return Game;
};
