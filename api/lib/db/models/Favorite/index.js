import models from '../';

export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    entity: {
      allowNull: false,
      type: DataTypes.ENUM('Team'),
      defaultValue: 'Team',
    },
    entityId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Favorite.belongsTo(models.Team, {
      foreignKey: 'entityId',
      constraints: false,
      as: 'Team',
    });
  };

  return Favorite;
};
