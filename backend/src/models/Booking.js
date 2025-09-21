const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    seats: { type: DataTypes.JSON }, // array of seat ids like ["R1C2","R1C3"]
    totalAmount: DataTypes.FLOAT
  }, { timestamps: true });
};
