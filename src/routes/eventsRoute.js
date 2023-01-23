const express = require('express');
const { Protect } = require('../middlewares/security');
const { getEvents, addEvent, updateEvent, deleteEvent, getUpcomingEvents } = require('../controllers/eventsController');

const eventsRoute = express.Router();

eventsRoute.get( `/get`, Protect, getEvents );
eventsRoute.get( `/getupcoming`, Protect, getUpcomingEvents );
eventsRoute.post( '/post', Protect, addEvent );
eventsRoute.patch( '/update', Protect, updateEvent );
eventsRoute.delete( '/delete', Protect, deleteEvent );

module.exports = { eventsRoute };