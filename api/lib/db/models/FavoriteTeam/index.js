import models from '../';

export default (sequelize, DataTypes) => {
  const FavoriteTeam = sequelize.define('FavoriteTeam', {
    teamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  FavoriteTeam.associate = function(models) {
    FavoriteTeam.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
    FavoriteTeam.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return FavoriteTeam;
};
