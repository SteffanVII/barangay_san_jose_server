const express = require("express");
const { getDashboardInfo } = require("../controllers/dashboardController");

const dashboardRoute = express.Router();

dashboardRoute.get("/", getDashboardInfo);

module.exports = { dashboardRoute };