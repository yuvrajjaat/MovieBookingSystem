const express = require('express');
const router = express.Router();
const db = require('../models');

// create booking
router.post('/', async (req, res) => {
  const { userId, showId, seats, socketId } = req.body;
  console.log('Booking request:', { userId, showId, seats, socketId });
  
  if (!userId || !showId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'userId, showId and seats[] required' });
  }
  if (seats.length > 6) {
    return res.status(400).json({ error: 'max 6 seats per booking' });
  }

  // check already booked
  const existingBookings = await db.Booking.findAll({ where: { ShowId: showId } });
  const alreadyBooked = new Set(existingBookings.flatMap(b => b.seats || []));
  for (const s of seats) {
    if (alreadyBooked.has(s)) {
      return res.status(409).json({ error: `Seat ${s} already booked` });
    }
  }

  // check blocked seats (in-memory)
  const blockedSeatsRef = req.app.get('blockedSeatsRef') || {};
  console.log('Blocked seats for show', showId, ':', blockedSeatsRef[showId]);
  
  if (blockedSeatsRef[showId]) {
    for (const s of seats) {
      if (blockedSeatsRef[showId][s]) {
        const blockedBy = blockedSeatsRef[showId][s].socketId;
        console.log(`Seat ${s} blocked by socket:`, blockedBy, 'Request from socket:', socketId);
        
        // allow booking if blocked by the same socket making the booking request
        if (socketId && blockedSeatsRef[showId][s].socketId === socketId) {
          console.log(`Allowing booking for seat ${s} - same socket`);
          continue; // same user/socket, allow booking
        }
        return res.status(409).json({ error: `Seat ${s} is temporarily blocked` });
      }
    }
  }

  const show = await db.Show.findByPk(showId);
  const total = (show && show.price ? show.price : 100) * seats.length;

  const booking = await db.Booking.create({ UserId: userId, ShowId: showId, seats, totalAmount: total });

  // broadcast booking to sockets so others mark seats as booked
  const io = req.app.get('io');
  if (io) {
    io.to(`show_${showId}`).emit('seatsBooked', { seats });
  }

  // clear any blocked seat timers for these seats if present
  if (blockedSeatsRef[showId]) {
    seats.forEach(s => {
      if (blockedSeatsRef[showId][s]) {
        clearTimeout(blockedSeatsRef[showId][s].timeoutId);
        delete blockedSeatsRef[showId][s];
      }
    });
  }

  res.json({ booking });
});

module.exports = router;
