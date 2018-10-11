'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    abbreviation: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    league: DataTypes.ENUM('NBA'),
    conference: DataTypes.STRING,
    division: DataTypes.STRING,
    site: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    xmlStatsId: DataTypes.STRING,
  }, {});
  Team.associate = function(models) {
    // associations can be defined here
  };
  return Team;
};
