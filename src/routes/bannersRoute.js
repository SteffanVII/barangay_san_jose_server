const express = require("express");
const { uploadBanner, getBanners, updateStatus, deleteBanner, repositionBanners } = require("../controllers/bannersController");
const { Protect } = require("../middlewares/security");
const { upload } = require("../middlewares/uploads");

const bannersRoute = express.Router();

bannersRoute.post( "/upload", Protect, upload.single("banner"), uploadBanner );
bannersRoute.get( "/getbanners", Protect, getBanners );
bannersRoute.patch( "/updatestatus", Protect, updateStatus );
bannersRoute.patch( "/reposition", Protect, repositionBanners );
bannersRoute.delete( "/deletebanner", Protect, deleteBanner );

module.exports = { bannersRoute };