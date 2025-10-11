const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const uploadRoutes = require("./uploadRoutes");
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/upload", uploadRoutes);
module.exports = router;
