'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Users', 'active', {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    }),
    queryInterface.changeColumn('Users', 'admin', {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    }),
    queryInterface.changeColumn('Users', 'fbId', {
      type: Sequelize.STRING,
      unique: true,
    }),
    queryInterface.changeColumn('Users', 'loginCount', {
      defaultValue: 0,
      type: Sequelize.INTEGER,
    }),
  ]),
  down() {},
};
