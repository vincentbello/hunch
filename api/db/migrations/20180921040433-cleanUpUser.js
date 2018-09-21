'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'gender', Sequelize.STRING),

  // down: (queryInterface, Sequelize) => {
  //   /*
  //     Add reverting commands here.
  //     Return a promise to correctly handle asynchronicity.

  //     Example:
  //     return queryInterface.dropTable('users');
  //   */
  // }
};
