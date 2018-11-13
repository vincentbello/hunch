'use strict';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstName: 'Jane',
    lastName: 'Schmoe',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'jane.schmoe@gmail.com',
    active: true,
    admin: false,
    fbId: '1234567',
    gender: 'F',
    imageUrl: 'https://www.shareicon.net/data/128x128/2016/05/24/769977_people_512x512.png',
    lastLoginAt: new Date(),
    currentLoginAt: new Date(),
    loginCount: 0,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {}),
};
