const express = require("express");
const { login, authenticate, logout } = require("../controllers/adminController");
const { Protect } = require("../middlewares/security");

const adminRoute = express.Router();

adminRoute.post("/logout", logout);
adminRoute.post("/login", login);
adminRoute.post("/authenticate", Protect, authenticate);

module.exports = { adminRoute };