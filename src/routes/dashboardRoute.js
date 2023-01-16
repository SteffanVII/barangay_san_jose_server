const express = require("express");
const { getDashboardInfo } = require("../controllers/dashboardController");
const { Protect } = require("../middlewares/security");

const dashboardRoute = express.Router();

dashboardRoute.get("/", Protect, getDashboardInfo);

module.exports = { dashboardRoute };