'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    fbId: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    gender: DataTypes.STRING,
    lastLoginAt: DataTypes.DATE,
    currentLoginAt: DataTypes.DATE,
    loginCount: DataTypes.INTEGER,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
