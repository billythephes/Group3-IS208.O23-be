const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createNotification,
    getNotifications
} = require("../controllers/notificationController");


router.post("/create", protect, adminOnly, createNotification);
router.get("/", protect, getNotifications);

module.exports = router;