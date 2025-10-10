const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const uploadRoutes = require("./uploadRoutes");
router.use("/auth", authRoutes);
router.use("/upload-image", uploadRoutes);
module.exports = router;
