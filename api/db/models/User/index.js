import Sequelize, { Op } from 'sequelize';
import models from '../';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    fbId: DataTypes.STRING,
    fbAccessToken: DataTypes.STRING(256),
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
  User.associate = function() {};

  User.populateFbFriendships = async function(userId, fbFriendIds) {
    const existingFriendships = await models.Friendship.findAll({
      attributes: [[Sequelize.literal(`CASE WHEN user.id=${userId} THEN friend.fbId ELSE user.fbId END`), 'friendFbId']],
      include: [
        { model: models.User, as: 'user', where: { id: Sequelize.col('friendship.userId') } },
        { model: models.User, as: 'friend', where: { id: Sequelize.col('friendship.friendId') } },
      ],
      raw: true,
      where: {
        [Op.or]: [
          { '$user.id$': userId },
          { '$friend.id$': userId },
        ],
        source: 'FB',
      },
    });
    const existingFriendIds = existingFriendships.map(({ friendFbId }) => friendFbId);
    const newFriendFbIds = fbFriendIds.filter(id => !existingFriendIds.includes(id));

    const newFriendUsers = await models.User.findAll({
      attributes: ['id'],
      raw: true,
      where: {
        fbId: {
          [Op.in]: newFriendFbIds,
        },
      },
    });
    const NOW = new Date();
    const newFriendships = newFriendUsers.map(friendUser => ({
      userId,
      friendId: friendUser.id,
      status: 'ACTIVE',
      source: 'FB',
      createdAt: NOW,
      updatedAt: NOW,
    }));
    await models.Friendship.bulkCreate(newFriendships);
  }
  return User;
};
