const express = require("express");
const { contactUs } = require("../controllers/contactController");
const router = express.Router();
const protectRoute = require("../middleWare/authMiddleware");

router.post("/", protectRoute, contactUs);

module.exports = router;
