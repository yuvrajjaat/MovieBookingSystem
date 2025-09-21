const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Movie', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    durationMinutes: DataTypes.INTEGER,
    language: DataTypes.STRING
  }, { timestamps: false });
};
