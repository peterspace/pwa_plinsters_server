// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  deleteNotification,
  sendNotification,
  subscribeUser,
  unsubscribeUser,
  broadcast,
} = require("../controllers/notificationController");

// CRUD routes for notifications
router.post("/", createNotification);
router.get("/", getAllNotifications);
router.delete("/:id", deleteNotification);

// Route to send notification
router.post("/send/:id", sendNotification);
router.post("/subscribe", subscribeUser);
router.post("/unsubscribe", unsubscribeUser);
router.get("/broadcast", broadcast);

module.exports = router;
