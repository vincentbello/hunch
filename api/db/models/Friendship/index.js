'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define('Friendship', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    friendId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PENDING', 'REJECTED', 'DELETED'),
      defaultValue: 'ACTIVE',
    },
    source: {
      type: DataTypes.ENUM('APP', 'FB'),
      defaultValue: 'APP',
    },
  }, {});
  Friendship.associate = function(models) {
    Friendship.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Friendship.belongsTo(models.User, { foreignKey: 'friendId', as: 'friend' });
  };

  return Friendship;
};
