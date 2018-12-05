'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('FavoriteTeams', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    teamId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('FavoriteTeams'),
};
