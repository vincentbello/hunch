import models from '../';
import Notification from '../../../services/Notification';

export default (sequelize, DataTypes) => {
  const Hunch = sequelize.define('Hunch', {
    type: {
      allowNull: false,
      type: DataTypes.ENUM('MONEY_LINE'),
      defaultValue: 'MONEY_LINE',
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    wager: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    responded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resolvedAt: DataTypes.DATE,
    lastRemindedAt: DataTypes.DATE,
    gameId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    bettorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    betteeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    winnerId: DataTypes.INTEGER,
    bettorPickTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  Hunch.associate = function(m) {
    Hunch.belongsTo(m.Game, { foreignKey: 'gameId', as: 'game' });
    Hunch.belongsTo(m.Team, { foreignKey: 'bettorPickTeamId', as: 'bettorPickTeam' });
    Hunch.belongsTo(m.User, { foreignKey: 'bettorId', as: 'bettor' });
    Hunch.belongsTo(m.User, { foreignKey: 'betteeId', as: 'bettee' });
  };

  Hunch.prototype.sendRequestNotifications = async function(remind = false) {
    const bettor = await models.User.findById(this.bettorId);
    const betteeDevices = await models.Device.findAll({ where: { userId: this.betteeId, allowedNotifications: true } });
    for (const device of betteeDevices) {
      const notification = new Notification({
        body: `${remind ? 'Don\'t forget! ' : ''}${bettor.fullName} has sent you a hunch request.`,
        payload: { hunchId: this.id },
      });
      await notification.send(device.token);
    }
  };

  Hunch.prototype.sendResponseNotifications = async function() {
    const bettee = await models.User.findById(this.betteeId);
    const devices = await models.Device.findAll({ where: { userId: this.bettorId } });
    for (const device of devices) {
      const notification = new Notification({
        body: `${this.accepted ? 'It\'s on! ' : ''}${bettee.fullName} ${this.accepted ? 'accepted' : 'rejected'} your hunch request.`,
        payload: this.accepted ? { hunchId: this.id } : null,
      });
      await notification.send(device.token);
    }
  };

  return Hunch;
};
