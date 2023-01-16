const express = require("express");
const { fetchBanners, fetchEvents } = require("../controllers/publicController");

const publicRoute = express.Router();

publicRoute.get( "/fetchbanners", fetchBanners );
publicRoute.get( "/fetchevents", fetchEvents );

module.exports = { publicRoute };