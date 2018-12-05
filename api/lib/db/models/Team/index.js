'use strict';

export default (sequelize, DataTypes) => {
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
    msfId: DataTypes.INTEGER,
    isFavorite: {
      type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      get() {
        return this.FavoriteTeam !== null;
      }
    },
  }, {});
  Team.associate = function(models) {
    Team.hasOne(models.FavoriteTeam);
  };
  return Team;
};
