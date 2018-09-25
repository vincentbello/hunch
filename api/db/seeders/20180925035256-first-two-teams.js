'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Teams', [
    {
      firstName: 'Los Angeles',
      lastName: 'Lakers',
      league: 'NBA',
      conference: 'Western',
      division: 'Pacific',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Golden State',
      lastName: 'Warriors',
      league: 'NBA',
      conference: 'Western',
      division: 'Pacific',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Teams', null, {}),
};
