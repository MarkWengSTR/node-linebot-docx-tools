'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'headings',
      'docxfileId',
      Sequelize.INTEGER
    );
  },

  async down (queryInterface) {
    return queryInterface.removeColumn('headings', 'docxfileId')
  }
};
