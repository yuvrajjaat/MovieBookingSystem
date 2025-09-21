const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Cinema', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    location: DataTypes.STRING
  }, { timestamps: false });
};
