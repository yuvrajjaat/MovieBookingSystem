const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize);
db.Cinema = require('./Cinema')(sequelize);
db.Screen = require('./Screen')(sequelize);
db.Movie = require('./Movie')(sequelize);
db.Show = require('./Show')(sequelize);
db.Booking = require('./Booking')(sequelize);

// Associations
db.Cinema.hasMany(db.Screen, { onDelete: 'CASCADE' });
db.Screen.belongsTo(db.Cinema);

db.Screen.hasMany(db.Show, { onDelete: 'CASCADE' });
db.Show.belongsTo(db.Screen);

db.Movie.hasMany(db.Show, { onDelete: 'CASCADE' });
db.Show.belongsTo(db.Movie);

db.User.hasMany(db.Booking, { onDelete: 'CASCADE' });
db.Booking.belongsTo(db.User);

db.Show.hasMany(db.Booking, { onDelete: 'CASCADE' });
db.Booking.belongsTo(db.Show);

module.exports = db;
