const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Show', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startTime: DataTypes.DATE,
    price: { type: DataTypes.FLOAT, defaultValue: 100.0 }
  }, { timestamps: false });
};
