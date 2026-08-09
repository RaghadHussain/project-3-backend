const Notification = require("../models/Notification");

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ reciver: req.user._id })
      .populate("sender", "username")
      .populate("post")
      .populate("comment")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  createNotification,
  getNotifications,
};
