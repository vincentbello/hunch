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
    favorite: {
      type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      get() {
        return Array.isArray(this.Favorites) && this.Favorites.length > 0;
      }
    },
  }, {});
  Team.associate = function(models) {
    Team.hasMany(models.Favorite, {
      foreignKey: 'entityId',
      constraints: false,
      scope: {
        entity: 'Team',
      },
    });
  };
  return Team;
};
