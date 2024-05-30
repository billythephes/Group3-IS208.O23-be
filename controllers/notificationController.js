const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");


const createNotification = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    const notification = await Notification.create({
        title,
        content,
    });

    if (notification) {
        res.status(201).json({
            _id: notification._id,
            title: notification.title,
            content: notification.content,
        });
    } else {
        res.status(400);
        throw new Error("Dữ liệu không hợp lệ!");
    }
});

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notifications);
});

module.exports = {
    createNotification,
    getNotifications
};