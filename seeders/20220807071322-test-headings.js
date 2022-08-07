'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('headings', [{
      text: 'This is test heading',
      level: 'level_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return  queryInterface.bulkDelete('headings', null, {});
  }
};
