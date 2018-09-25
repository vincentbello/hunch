'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    league: DataTypes.ENUM('NBA'),
    conference: DataTypes.STRING,
    division: DataTypes.STRING
  }, {});
  Team.associate = function(models) {
    // associations can be defined here
  };
  return Team;
};
