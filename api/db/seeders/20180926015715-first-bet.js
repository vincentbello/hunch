'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const devUserFbId = '10154695548923728';
    const users = await queryInterface.sequelize.query('SELECT id, fbId FROM Users');
    let devUserId;

    const otherUserIds = users[0].reduce((userIds, row) => {
      if (row.fbId === devUserFbId) {
        devUserId = row.id;
      } else {
        userIds.push(row.id);
      }

      return userIds;
    }, []);

    const games = await queryInterface.sequelize.query('SELECT id FROM Games');
    const gameRows = games[0];

    return await queryInterface.bulkInsert('Bets', [
      {
        type: 'MONEY_LINE',
        amount: 5,
        wager: 'The Lakers will beat the Warriors',
        active: true,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        gameId: gameRows[0].id,
        bettorId: devUserId,
        betteeId: otherUserIds[0],
        winnerId: null,
      },
      {
        type: 'MONEY_LINE',
        amount: 1,
        wager: 'The Warriors will beat the Lakers',
        active: true,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        gameId: gameRows[1].id,
        bettorId: otherUserIds[1],
        betteeId: devUserId,
        winnerId: null,
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
