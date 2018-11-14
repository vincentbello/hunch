'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Games', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    league: Sequelize.ENUM('NBA'),
    season: Sequelize.INTEGER,
    seasonType: Sequelize.ENUM('PRE', 'REGULAR', 'POST'),
    completed: Sequelize.BOOLEAN,
    homeScore: Sequelize.INTEGER,
    awayScore: Sequelize.INTEGER,
    week: Sequelize.INTEGER,
    startDate: Sequelize.DATE,
    xmlStatsId: Sequelize.STRING,
    msfId: Sequelize.INTEGER,
    homeTeamId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
    },
    awayTeamId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Games'),
};
