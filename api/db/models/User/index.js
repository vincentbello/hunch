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
    fullName: {
      type: DataTypes.VIRTUAL(DataTypes.STRING, ['firstName', 'lastName']),
      get() {
        return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
      }
    },
  }, {});
  User.associate = function(models) {
  };
  return User;
};
