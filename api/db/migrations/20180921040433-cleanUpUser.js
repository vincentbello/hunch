'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'gender', Sequelize.STRING),
};
