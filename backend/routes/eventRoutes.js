const express = require('express');
const { newEvent, getEvents, getEventById, updateEvent, deleteEvent, attendEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.route('/')
  .post(protect, newEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.route('/:id/attend').post(protect, attendEvent);

module.exports = router;
