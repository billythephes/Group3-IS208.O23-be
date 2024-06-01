const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createNotification,
    getNotifications,
    deleteNotification
} = require("../controllers/notificationController");


router.post("/create", protect, adminOnly, createNotification);
router.get("/", protect, getNotifications);
router.delete("/delete/:id", protect, adminOnly, deleteNotification);

module.exports = router;