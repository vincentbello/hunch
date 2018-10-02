'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Teams', [
    {
      abbreviation: 'LAL',
      firstName: 'Los Angeles',
      lastName: 'Lakers',
      imageUrl: 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/lal.png&h=70&w=70',
      league: 'NBA',
      conference: 'Western',
      division: 'Pacific',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      abbreviation: 'GSW',
      firstName: 'Golden State',
      lastName: 'Warriors',
      imageUrl: 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/gs.png&h=70&w=70',
      league: 'NBA',
      conference: 'Western',
      division: 'Pacific',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Teams', null, {}),
};
