const express = require("express");
const { getRequestList, getRequestInfo, changeRequestStatus, registerRequest, checkRequestStatus } = require("../controllers/requestsController");
const { generateRequestId } = require("../middlewares/requestIdGenerator");
const { Protect } = require("../middlewares/security");

const requestsRoute = express.Router();

requestsRoute.get("/requestslist", Protect ,getRequestList);
requestsRoute.get("/requestinfo", Protect, getRequestInfo);
requestsRoute.patch("/changeStatus", Protect, changeRequestStatus);
requestsRoute.post("/requesting", generateRequestId, registerRequest);
requestsRoute.post("/checking", checkRequestStatus);

module.exports = { requestsRoute };