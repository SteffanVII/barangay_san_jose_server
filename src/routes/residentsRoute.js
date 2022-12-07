const express = require("express");
const { getResidentsAll, getTotalResidents } = require("../controllers/residentsController");

const residentsRoute = express.Router();

residentsRoute.get("/getresidentsall", getResidentsAll );
residentsRoute.get("/gettotalresidents", getTotalResidents );

module.exports = { residentsRoute };