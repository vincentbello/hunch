'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Teams', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    abbreviation: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    league: Sequelize.ENUM('NBA'),
    conference: Sequelize.STRING,
    division: Sequelize.STRING,
    site: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    xmlStatsId: Sequelize.STRING,
    msfId: Sequelize.INTEGER,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Teams'),
};
