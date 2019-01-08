import Sequelize, { Op } from 'sequelize';
import difference from 'lodash.difference';
import FB from '../../../services/facebook';
import models from '../';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    fbId: DataTypes.STRING,
    fbAccessToken: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    gender: DataTypes.STRING,
    fbExpiresAt: DataTypes.DATE,
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
    if (fbFriendIds.length === 0) return;

    const existingFriendships = await models.Friendship.findAll({
      attributes: [[Sequelize.literal(`CASE WHEN user.id=${userId} THEN friend.fbId ELSE user.fbId END`), 'friendFbId']],
      include: [
        { model: models.User, as: 'user', where: { id: Sequelize.col('Friendship.userId') } },
        { model: models.User, as: 'friend', where: { id: Sequelize.col('Friendship.friendId') } },
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
    const newFriendFbIds = difference(fbFriendIds, existingFriendIds);

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
      userId: userId > friendUser.id ? friendUser.id : userId,
      friendId: userId > friendUser.id ? userId : friendUser.id,
      status: 'ACTIVE',
      source: 'FB',
      createdAt: NOW,
      updatedAt: NOW,
    }));
    await models.Friendship.bulkCreate(newFriendships);
  };

  User.getFriends = async function(userId) {
    const friendsQuery = `
      SELECT B.* FROM (
        SELECT userId as friendId FROM Friendships WHERE friendId=${userId} AND status="ACTIVE"
        UNION
        SELECT friendId FROM Friendships WHERE userId=${userId} AND status="ACTIVE"
      ) A
      INNER JOIN Users B
      ON A.friendId = B.id
      ORDER BY B.firstName ASC
    `;
    return await models.sequelize.query(friendsQuery, {
      model: models.User,
      type: Sequelize.QueryTypes.SELECT,
    });
  };

  User.getFriendRequests = async function(userId) {
    const friendRequestsQuery = `SELECT A.* FROM Users A INNER JOIN Friendships B ON A.id = B.userId WHERE B.friendId=${userId} AND B.status='PENDING'`;
    return await models.sequelize.query(friendRequestsQuery, {
      model: models.User,
      type: Sequelize.QueryTypes.SELECT,
    });
  };

  User.prototype.getFacebookFriends = async function() {
    if (!this.fbId || !this.fbAccessToken) return [];

    const friends = await FB.api(`${this.fbId}/friends`, { access_token: this.fbAccessToken });
    if (!friends || friends.error) return [];

    return await models.User.findAll({
      where: {
        fbId: friends.data.map(friend => friend.id),
      },
    });
  };

  return User;
};
