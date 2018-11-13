'use strict';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'john.doe@gmail.com',
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
