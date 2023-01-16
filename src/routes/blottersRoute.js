const express = require("express");
const { getBlottersList, getBlotterInfo, updateBlotterInfo, deleteBlotter, registerBlotter } = require("../controllers/blottersController");
const { protect, Protect } = require("../middlewares/security");

const blottersRoute = express.Router();

blottersRoute.get( "/getblotters", Protect, getBlottersList );
blottersRoute.get("/getblotterinfo", Protect, getBlotterInfo );
blottersRoute.patch("/patchblotterinfo", Protect, updateBlotterInfo);
blottersRoute.delete("/deleteblotterinfo", Protect, deleteBlotter);
blottersRoute.post("/registerblotter", Protect, registerBlotter);

module.exports = { blottersRoute };