const express = require("express");
const { fetchBanners, fetchEvents, fetchUpcomingEvents } = require("../controllers/publicController");

const publicRoute = express.Router();

publicRoute.get( "/fetchbanners", fetchBanners );
publicRoute.get( "/fetchevents", fetchEvents );
publicRoute.get( "/fetchupcomingevents", fetchUpcomingEvents );

module.exports = { publicRoute };