'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Heading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Heading.init({
    text: DataTypes.STRING,
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Heading',
  });

  return Heading;
};
