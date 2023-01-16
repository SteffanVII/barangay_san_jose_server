const express = require("express");
const { getResidentsAll, getTotalResidents, registerResident, updateResident } = require("../controllers/residentsController");
const { Protect } = require("../middlewares/security");

const residentsRoute = express.Router();

residentsRoute.get("/getresidentsall", Protect, getResidentsAll );
residentsRoute.get("/gettotalresidents", Protect, getTotalResidents );
residentsRoute.post("/registerresident", Protect, registerResident);
residentsRoute.patch("/updateresident", Protect, updateResident);

module.exports = { residentsRoute };