'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    type: DataTypes.ENUM('ANDROID', 'IOS'),
    token: DataTypes.STRING,
    allowedNotifications: DataTypes.BOOLEAN,
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  Device.associate = function(models) {
    Device.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Device;
};
