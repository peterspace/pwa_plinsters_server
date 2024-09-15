// controllers/notificationController.js
const Notification = require("../models/Notification");
const User = require("../models/User"); // Assuming you have a User model
const webpush = require("web-push");
const PushNotifications = require("node-pushnotifications");

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL;

console.log({ VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL });

webpush.setVapidDetails(
  `mailto:${VAPID_EMAIL}`,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { title, body, targetUsers } = req.body;
    const notification = new Notification({
      title,
      body,
      targetUsers,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a notification to targeted users or all users
const sendNotification1 = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const users =
      notification.targetUsers.length > 0
        ? await User.find({ _id: { $in: notification.targetUsers } })
        : await User.find({}); // If no target users, send to all users

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
    });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription) {
        try {
          await webpush.sendNotification(user.pushSubscription, payload);
        } catch (error) {
          console.error("Failed to send push notification", error);
        }
      }
    });

    await Promise.all(userPushPromises);

    notification.status = "sent";
    notification.sentAt = new Date();
    await notification.save();

    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendNotification2 = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const users =
      notification.targetUsers.length > 0
        ? await User.find({ _id: { $in: notification.targetUsers } })
        : await User.find({}); // If no target users, send to all users

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
    });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription) {
        // Log the subscription object for debugging purposes
        console.log(
          "Sending to user:",
          user._id,
          "Subscription:",
          user.pushSubscription
        );

        if (user.pushSubscription.endpoint) {
          try {
            await webpush.sendNotification(user.pushSubscription, payload);
          } catch (error) {
            console.error("Failed to send push notification", error);
          }
        } else {
          console.error("Missing endpoint for user:", user._id);
        }
      } else {
        console.error("User has no pushSubscription:", user._id);
      }
    });

    await Promise.all(userPushPromises);

    notification.status = "sent";
    notification.sentAt = new Date();
    await notification.save();

    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const users =
      notification.targetUsers.length > 0
        ? await User.find({ _id: { $in: notification.targetUsers } })
        : await User.find({}); // If no target users, send to all users

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
    });

    console.log({ payload });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription && user.pushSubscription.endpoint) {
        try {
          const response = await webpush.sendNotification(
            user.pushSubscription,
            payload
          );
          console.log({ pushResponse: response });
        } catch (error) {
          console.error(`Failed to send notification to ${user._id}:`, error);
        }
      }
    });

    await Promise.all(userPushPromises);

    notification.status = "sent";
    notification.sentAt = new Date();
    await notification.save();

    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 
sample user data

Sending to user: new ObjectId('66987f1e0469a1183bdda1fd') Subscription: {
  keys: {
    p256dh: 'BIVLVrBWtaEA3wYj8l1ZoHRayZqm8RKITOXsZUqs34f9yC9HVhSubJFV81myIlwgTqxbDrs8_sAXY_ATTCAlfW8',
    auth: 'SM6kFGVakZfBSm6coGE1zw'
  },
  endpoint: 'https://fcm.googleapis.com/fcm/send/doV_6DLjHJo:APA91bG0dVBQteuOH2cElwOJ5XXIg3lO761pf3VXBA9Rke2W_PDlBfDTQ4Gc_6LXrYUKjnqXgW205cOzhb2fgKd09TM-K83vBRzuq5y0LtP1zwkHvJoylL4BOqRF_Bep_CaoFDwUQvRJ'
}

sample result:
{
  "message": "Notification sent"
}
 */

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Subscribe user to push notifications
const subscribeUser = async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    console.log({ content: req.body });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's push subscription
    user.pushSubscription = subscription;
    await user.save();
    console.log({ message: "User subscribed to push notifications" });

    // Get pushSubscription object
    const settings = {
      web: {
        vapidDetails: {
          subject: `mailto:${VAPID_EMAIL}`, // REPLACE_WITH_YOUR_EMAIL
          publicKey: VAPID_PUBLIC_KEY,
          privateKey: VAPID_PRIVATE_KEY,
        },
        gcmAPIKey: "gcmkey",
        TTL: 2419200,
        contentEncoding: "aes128gcm",
        headers: {},
      },
      isAlwaysUseFCM: false,
    };

    // Send 201 - resource created
    const push = new PushNotifications(settings);
    // Create payload
    const payload = { title: "Notification from Knock" };
    push.send(subscription, payload, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });

    res.status(200).json({ message: "User subscribed to push notifications" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(subscription);
  const settings = {
    web: {
      vapidDetails: {
        subject: "mailto:colin@knock.app", // REPLACE_WITH_YOUR_EMAIL
        publicKey: publicVapidKey,
        privateKey: privateVapidKey,
      },
      gcmAPIKey: "gcmkey",
      TTL: 2419200,
      contentEncoding: "aes128gcm",
      headers: {},
    },
    isAlwaysUseFCM: false,
  };

  // Send 201 - resource created
  const push = new PushNotifications(settings);

  // Create payload
  const payload = { title: "Notification from Knock" };
  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

/**
 * Example response
 * {
  content: {
    userId: '66987f1e0469a1183bdda1fd',
    subscription: {
      endpoint: 'https://fcm.googleapis.com/fcm/send/doV_6DLjHJo:APA91bG0dVBQteuOH2cElwOJ5XXIg3lO761pf3VXBA9Rke2W_PDlBfDTQ4Gc_6LXrYUKjnqXgW205cOzhb2fgKd09TM-K83vBRzuq5y0LtP1zwkHvJoylL4BOqRF_Bep_CaoFDwUQvRJ',
      expirationTime: null,
      keys: [Object]
    }
  }
}
{ message: 'User subscribed to push notifications' }
 * 
 * 
 * 
 */
// controllers/notificationController.js

// Unsubscribe user from push notifications
const unsubscribeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user's push subscription
    user.pushSubscription = null;
    await user.save();
    console.log({ message: "User unsubscribed from push notifications" });
    res
      .status(200)
      .json({ message: "User unsubscribed from push notifications" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const broadcast1 = async (req, res) => {
  try {
    const notification = { title: "Hey, this is a push notification!" };

    const subscriptions = await subscriptionRepository.getAll();

    const notifications = [];
    subscriptions.forEach((subscription) => {
      notifications.push(
        webpush.sendNotification(subscription, JSON.stringify(notification))
      );
    });

    await Promise.all(notifications);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const broadcast = async (req, res) => {
  const notifications = await Notification.find();
  if (!notifications) {
    return;
  }
  notifications.map(async ({ _id }) => {
    try {
      const notification = await Notification.findById(_id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      const users =
        notification.targetUsers.length > 0
          ? await User.find({ _id: { $in: notification.targetUsers } })
          : await User.find({}); // If no target users, send to all users

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
      });

      console.log({ payload });

      const userPushPromises = users.map(async (user) => {
        if (user.pushSubscription && user.pushSubscription.endpoint) {
          try {
            const response = await webpush.sendNotification(
              user.pushSubscription,
              payload
            );
            console.log({ pushResponse: response });
          } catch (error) {
            console.error(`Failed to send notification to ${user._id}:`, error);
          }
        }
      });

      await Promise.all(userPushPromises);

      notification.status = "sent";
      notification.sentAt = new Date();
      await notification.save();

      res.status(200).json({ message: "Notification sent" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification,
  sendNotification,
  subscribeUser,
  unsubscribeUser,
  broadcast,
};
