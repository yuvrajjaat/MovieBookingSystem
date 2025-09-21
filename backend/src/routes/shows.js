const express = require('express');
const router = express.Router();
const db = require('../models');

// get shows for a screen
router.get('/screen/:screenId', async (req, res) => {
  const shows = await db.Show.findAll({ where: { ScreenId: req.params.screenId }, include: [db.Movie] });
  res.json(shows);
});

// get show details
router.get('/:id', async (req, res) => {
  const show = await db.Show.findByPk(req.params.id, { include: [db.Movie, db.Screen] });
  res.json(show);
});

// get booked seats for a show
router.get('/:id/booked-seats', async (req, res) => {
  const bookings = await db.Booking.findAll({ where: { ShowId: req.params.id } });
  const seats = bookings.flatMap(b => b.seats || []);
  // also include in-memory blocked seats
  const blocked = [];
  const blockedSeatsRef = req.app.get('blockedSeatsRef') || {};
  if (blockedSeatsRef[req.params.id]) {
    Object.keys(blockedSeatsRef[req.params.id]).forEach(k => blocked.push(k));
  }
  res.json({ booked: seats, blocked });
});

module.exports = router;
