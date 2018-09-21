'use strict';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstName: 'Vince',
    lastName: 'Bello',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'vincent.bello@gmail.com',
    active: true,
    admin: true,
    fbId: '666488727',
    gender: 'M',
    lastLoginAt: new Date(),
    currentLoginAt: new Date(),
    loginCount: 0,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {}),
};
