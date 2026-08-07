const Notification = require("../models/Notification");

async function createNotification(req, res) {
  try {
    const { reciver, type, post, comment } = req.body;

    if (!reciver || !type || !post || !comment) {
      return res
        .status(400)
        .json({ message: "reciver, type, post and comment are required." });
    }

    const createdNotification = await Notification.create({
      reciver,
      type,
      post,
      comment,
      sender: req.user._id,
    });

    res.status(201).json(createdNotification);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

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
