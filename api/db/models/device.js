'use strict';
import User from './User';

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    type: DataTypes.ENUM('ANDROID', 'IOS'),
    token: DataTypes.STRING,
    allowedNotifications: DataTypes.BOOLEAN,
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  }, {});
  Device.associate = function(models) {
    // associations can be defined here
  };
  return Device;
};
