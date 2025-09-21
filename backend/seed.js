require('dotenv').config();
const db = require('./src/models');

async function seed() {
  await db.sequelize.sync({ force: true });
  console.log('DB synced.');

  const cinema1 = await db.Cinema.create({ name: 'PVR Plaza', location: 'Nagpur' });
  const cinema2 = await db.Cinema.create({ name: 'Cineworld Mall', location: 'Nagpur' });

  const screen1 = await db.Screen.create({ name: 'Screen 1', rows: 10, cols: 10, CinemaId: cinema1.id });
  const screen2 = await db.Screen.create({ name: 'Screen 2', rows: 10, cols: 10, CinemaId: cinema1.id });
  const screen3 = await db.Screen.create({ name: 'Screen A', rows: 10, cols: 10, CinemaId: cinema2.id });

  const movie1 = await db.Movie.create({ title: 'The Great Adventure', description: 'Action packed', durationMinutes: 140, language: 'English' });
  const movie2 = await db.Movie.create({ title: 'Romance in Rain', description: 'Love story', durationMinutes: 120, language: 'Hindi' });

  const now = new Date();
  const addHours = (h) => new Date(now.getTime() + h*60*60*1000);

  await db.Show.create({ MovieId: movie1.id, ScreenId: screen1.id, startTime: addHours(2), price: 150 });
  await db.Show.create({ MovieId: movie1.id, ScreenId: screen1.id, startTime: addHours(5), price: 150 });
  await db.Show.create({ MovieId: movie2.id, ScreenId: screen2.id, startTime: addHours(3), price: 120 });
  await db.Show.create({ MovieId: movie2.id, ScreenId: screen3.id, startTime: addHours(4), price: 120 });

  await db.User.create({ name: 'Test User', email: 'test@example.com' });

  console.log('Seed completed.');
  process.exit(0);
}

seed();
