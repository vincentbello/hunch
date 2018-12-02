import models from '../';
import Notification from '../../../services/Notification';

export default (sequelize, DataTypes) => {
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
  }, {
    indexes: [{ unique: true, fields: ['userId', 'friendId'] }],
  });
  Friendship.associate = function(models) {
    Friendship.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Friendship.belongsTo(models.User, { foreignKey: 'friendId', as: 'friend' });
  };

  Friendship.prototype.sendNotification = async function(userId, status) {
    if (!['ACTIVE', 'PENDING'].includes(status)) return;

    const sourceUserId = this.userId === userId ? this.friendId : userId;
    const targetUserId = this.userId === userId ? userId : this.friendId;
    const request = status === 'PENDING';
    const sourceUser = await models.User.findById(sourceUserId);
    const targetUser = await models.User.findById(targetUserId);
    const devices = await models.Device.findAll({ where: { userId: targetUserId } });
    const body = request ? `${sourceUser.fullName} has sent you a friend request.` : `You and ${sourceUser.fullName} are now friends!`;
    for (const device of devices) {
      const notification = new Notification({
        body,
        payload: { userId: sourceUserId },
      });
      await notification.send(device.token);
    }
  };

  return Friendship;
};
