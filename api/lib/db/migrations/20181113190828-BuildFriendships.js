'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Friendships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      friendId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'PENDING', 'REJECTED', 'DELETED'),
        defaultValue: 'ACTIVE',
      },
      source: {
        type: Sequelize.ENUM('APP', 'FB'),
        defaultValue: 'APP',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('Friendships', {
      fields: ['userId', 'friendId'],
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Friendships'),
};
