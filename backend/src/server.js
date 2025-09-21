require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./models');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

// In-memory blocked seats structure: { [showId]: { seatId: { timeoutId, socketId }, ... } }
const blockedSeats = {}; // ephemeral: resets when server restarts

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // join a room for a specific show
  socket.on('joinShow', ({ showId }) => {
    socket.join(`show_${showId}`);
  });

  // block seats temporarily (e.g., when a user selects)
  socket.on('blockSeats', ({ showId, seats, ttl = 120000 }) => {
    if (!blockedSeats[showId]) blockedSeats[showId] = {};

    seats.forEach((s) => {
      if (blockedSeats[showId][s]) {
        // clear prior timeout
        clearTimeout(blockedSeats[showId][s].timeoutId);
      }
      // set timeout to auto-unblock
      const timeoutId = setTimeout(() => {
        delete blockedSeats[showId][s];
        io.to(`show_${showId}`).emit('seatsUnblocked', { seats: [s] });
      }, ttl);
      
      blockedSeats[showId][s] = {
        timeoutId,
        socketId: socket.id
      };
    });

    io.to(`show_${showId}`).emit('seatsBlocked', { seats, by: socket.id });
  });

  // explicitly unblock (e.g., user deselects)
  socket.on('unblockSeats', ({ showId, seats }) => {
    if (!blockedSeats[showId]) return;
    seats.forEach((s) => {
      if (blockedSeats[showId][s]) {
        clearTimeout(blockedSeats[showId][s].timeoutId);
        delete blockedSeats[showId][s];
      }
    });
    io.to(`show_${showId}`).emit('seatsUnblocked', { seats });
  });

  socket.on('disconnect', () => {
    // We won't do advanced cleanup here (we use TTL on blocks).
    console.log('socket disconnect', socket.id);
  });
});

// Provide API for checking blocked seats to backend logic
app.set('io', io);
app.set('blockedSeatsRef', blockedSeats);

// sync DB then start
const PORT = process.env.PORT || 4000;
db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});
