'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Games', 'number', { allowNull: false, type: Sequelize.INTEGER }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Games', 'number'),
};
