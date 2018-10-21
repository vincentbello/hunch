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
    xmlStatsId: DataTypes.STRING,
    msfId: DataTypes.INTEGER,
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
    Game.belongsTo(models.Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
    Game.belongsTo(models.Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });
  };
  return Game;
};
