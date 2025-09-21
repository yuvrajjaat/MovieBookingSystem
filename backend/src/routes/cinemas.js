const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
  const cinemas = await db.Cinema.findAll();
  res.json(cinemas);
});

router.get('/:id/screens', async (req, res) => {
  const screens = await db.Screen.findAll({ where: { CinemaId: req.params.id }});
  res.json(screens);
});

router.get('/:id/screens/shows', async (req, res) => {
  // list shows for all screens in a cinema
  const shows = await db.Show.findAll({
    include: [{ model: db.Screen, where: { CinemaId: req.params.id }}, db.Movie]
  });
  res.json(shows);
});

module.exports = router;
