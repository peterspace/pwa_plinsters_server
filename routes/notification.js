// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createNotification,
  createSingleNotification,
  getNotificationsById,
  getAllNotifications,
  deleteNotification,
  sendNotification,
  sendTargetGroupNotification,
  subscribeUser,
  unsubscribeUser,
  broadcast,
  //===============================
  oneWeekAgoGroup,
  sendOneSignalNotificationMain,
  sendOneSignalNotification,
  sendBonusNotificationByCountry,
  sendRegistrationNotification,
  sendPurchaseNotification,
  sendInstallNotification,
  sendDailyNotificationToAllCountries,
  
} = require("../controllers/notificationController");

// CRUD routes for notifications
router.post("/", createNotification);
router.post("/create-single-notification", createSingleNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationsById);
router.delete("/:id", deleteNotification);

// Route to send notification
router.post("/send/:id", sendNotification);
router.post("/send-to-target-users", sendTargetGroupNotification);
router.post("/subscribe", subscribeUser);
router.post("/unsubscribe", unsubscribeUser);
router.get("/broadcast", broadcast);
router.post("/oneWeekAgoGroup", oneWeekAgoGroup);
router.post("/sendOneSignalNotificationMain", sendOneSignalNotificationMain);
router.post("/sendOneSignalNotification", sendOneSignalNotification);
router.post("/sendBonusNotificationByCountry", sendBonusNotificationByCountry);
router.post("/sendRegistrationNotification", sendRegistrationNotification);
router.post("/sendPurchaseNotification", sendPurchaseNotification);
router.post("/sendInstallNotification", sendInstallNotification);
router.post(
  "/sendDailyNotificationToAllCountries",
  sendDailyNotificationToAllCountries
);

module.exports = router;
