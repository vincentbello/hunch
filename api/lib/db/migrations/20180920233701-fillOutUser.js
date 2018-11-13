'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'email', Sequelize.STRING),
    queryInterface.addColumn('Users', 'lastName', Sequelize.STRING),
    queryInterface.addColumn('Users', 'active', Sequelize.BOOLEAN),
    queryInterface.addColumn('Users', 'admin', Sequelize.BOOLEAN),
    queryInterface.addColumn('Users', 'fbId', Sequelize.STRING),
    queryInterface.addColumn('Users', 'imageUrl', Sequelize.STRING),
    queryInterface.addColumn('Users', 'gender', Sequelize.ENUM('F', 'M')),
    queryInterface.addColumn('Users', 'lastLoginAt', Sequelize.DATE),
    queryInterface.addColumn('Users', 'currentLoginAt', Sequelize.DATE),
    queryInterface.addColumn('Users', 'loginCount', Sequelize.INTEGER),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Users', 'email'),
    queryInterface.removeColumn('Users', 'lastName'),
    queryInterface.removeColumn('Users', 'active'),
    queryInterface.removeColumn('Users', 'admin'),
    queryInterface.removeColumn('Users', 'fbId'),
    queryInterface.removeColumn('Users', 'imageUrl'),
    queryInterface.removeColumn('Users', 'gender'),
    queryInterface.removeColumn('Users', 'lastLoginAt'),
    queryInterface.removeColumn('Users', 'currentLoginAt'),
    queryInterface.removeColumn('Users', 'loginCount'),
  ]),
};
