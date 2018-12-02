'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const teams = await queryInterface.sequelize.query('SELECT id FROM Teams');
    const teamRows = teams[0];
    const lakersId = teamRows[0].id;
    const warriorsId = teamRows[1].id;

    return await queryInterface.bulkInsert('Games', [
      {
        league: 'NBA',
        season: 2017,
        seasonType: 'REGULAR',
        completed: true,
        homeScore: 117,
        awayScore: 97,
        week: 0,
        homeTeamId: lakersId,
        awayTeamId: warriorsId,
        startDate: new Date(2016, 10, 4, 19, 30),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        league: 'NBA',
        season: 2017,
        seasonType: 'REGULAR',
        completed: true,
        homeScore: 149,
        awayScore: 106,
        week: 0,
        homeTeamId: warriorsId,
        awayTeamId: lakersId,
        startDate: new Date(2016, 10, 23, 19, 0),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Games', null, {}),
};
