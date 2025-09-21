const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Screen', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    rows: { type: DataTypes.INTEGER, defaultValue: 10 },
    cols: { type: DataTypes.INTEGER, defaultValue: 10 }
  }, { timestamps: false });
};
