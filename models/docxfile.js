'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocxFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DocxFile.hasMany(models.Heading)
    }
  }
  DocxFile.init({
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }, 
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DocxFile',
  });
  return DocxFile;
};
