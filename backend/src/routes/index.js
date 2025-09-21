const express = require('express');
const router = express.Router();

router.use('/cinemas', require('./cinemas'));
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/shows', require('./shows'));
router.use('/bookings', require('./bookings'));

router.get('/health', (req, res) => res.json({ ok: true }));

module.exports = router;
