const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const NotificationController = require("../controllers/notification.controller");

router.get("/", verifyToken, NotificationController.getNotifications);
router.post("/", verifyToken, NotificationController.createNotification);

module.exports = router;
