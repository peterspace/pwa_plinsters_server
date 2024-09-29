// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  targetUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User", // Assuming you have a User model
    default: [], // Empty array means target all users
  },
  icon: {
    type: String,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "sent"],
    default: "pending",
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
