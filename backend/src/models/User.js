const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true }
  }, {
    timestamps: true
  });
};
