const express = require('express');
const router = express.Router();
const db = require('../models');

// Create user
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [user, created] = await db.User.findOrCreate({ where: { email }, defaults: { name, email } });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user bookings
router.get('/:id/bookings', async (req, res) => {
  try {
    const bookings = await db.Booking.findAll({ where: { UserId: req.params.id }, include: [{ model: db.Show, include: [db.Movie, db.Screen] }] });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
