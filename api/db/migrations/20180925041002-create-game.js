'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      league: {
        type: Sequelize.ENUM('NBA')
      },
      season: {
        type: Sequelize.INTEGER
      },
      seasonType: {
        type: Sequelize.ENUM('PRE', 'REGULAR', 'POST')
      },
      completed: {
        type: Sequelize.BOOLEAN
      },
      homeScore: {
        type: Sequelize.INTEGER
      },
      awayScore: {
        type: Sequelize.INTEGER
      },
      week: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      homeTeamId: {
        type: Sequelize.INTEGER,
        references: { model: 'Team', key: 'id' }
      },
      awayTeamId: {
        type: Sequelize.INTEGER,
        references: { model: 'Team', key: 'id' }
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  }
};
