'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'docxfiles',
      'version',
      Sequelize.INTEGER
    );
  },

  async down (queryInterface) {
    return queryInterface.removeColumn('docxfiles', 'version')
  }
};
