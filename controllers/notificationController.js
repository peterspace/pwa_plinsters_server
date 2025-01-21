// controllers/notificationController.js
const axios = require("axios");
const moment = require("moment-timezone");
const cron = require("node-cron");
const Notification = require("../models/Notification");
const User = require("../models/User"); // Assuming you have a User model
const Admin = require("../models/Admin");
const Pwa = require("../models/Pwa");
const one_signal_api_key = process.env.ONE_SIGNAL_API_KEY;
const one_signal_app_id = process.env.ONE_SIGNAL_APP_ID;
const default_app_id = process.env.DEFAULT_APP_ID;

// const PushNotifications = require("node-pushnotifications");
const webpush = require("web-push");

const VAPID_EMAIL = process.env.VAPID_EMAIL;
//===={new approach}================================
const publicVapidKey = process.env.VAPID_PUBLIC_KEY; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY; //REPLACE_WITH_YOUR_KEY
const frontend = process.env.FRONTEND_URL;

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto: peter.space.io@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// console.log({ subscription });
// const settings = {
//   web: {
//     vapidDetails: {
//       subject: "mailto: <peter.space.io@gmail.com>", // REPLACE_WITH_YOUR_EMAIL
//       publicKey: publicVapidKey,
//       privateKey: privateVapidKey,
//     },
//     gcmAPIKey: "gcmkey",
//     TTL: 2419200,
//     contentEncoding: "aes128gcm",
//     headers: {},
//   },
//   isAlwaysUseFCM: false,
// };

// Send 201 - resource created
// const push = new PushNotifications(settings);

// Helper function to schedule a notification
const scheduleNotification = (notification) => {
  let cronTime;

  if (notification.isRecurring) {
    if (notification.recurrence.type === "daily") {
      const [hour, minute] = notification.scheduleTime.split(":");
      cronTime = `${minute} ${hour} * * *`; // Every day at the specified time
    } else if (notification.recurrence.type === "weekly") {
      const days = notification.recurrence.daysOfWeek.join(",");
      const [hour, minute] = notification.scheduleTime.split(":");
      cronTime = `${minute} ${hour} * * ${days}`; // Weekly on selected days
    } else if (notification.recurrence.type === "custom") {
      cronTime = notification.recurrence.cronExpression; // Custom cron expression
    }
  } else {
    const [hour, minute] = notification.scheduleTime.split(":");
    cronTime = `${minute} ${hour} * * *`; // Default to daily at specified time if not recurring
  }

  cron.schedule(cronTime, async () => {
    await sendNotificationById(notification._id);
  });
};

// Helper function to send a notification by ID
const sendNotificationById = async (notificationId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    console.log("Notification not found");
    return;
  }

  if (notification.status === "sent") {
    console.log("Notification sent");
    return;
  }

  try {
    const users =
      notification.targetUsers.length > 0
        ? await User.find({ _id: { $in: notification.targetUsers } })
        : await User.find({}); // If no target users, send to all users

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || "",
      link: notification.icon || frontend,
    });

    console.log({ payload });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription && user.pushSubscription.endpoint) {
        const subscription = user.pushSubscription;

        // push.send(subscription, payload, (err, result) => {
        //   if (err) {
        //     console.log({ pushError: err });
        //   } else {
        //     console.log({ pushResponse: result });
        //   }
        // });
        // Send the notification
        // Send the notification
        webpush
          .sendNotification(subscription, payload)
          .then(() =>
            console.log({
              success: true,
              message: "Notification sent successfully",
            })
          )
          .catch((error) => {
            console.error("Error sending notification", error);
            console.log({ success: false, message: "Notification failed" });
          });
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

// Modified createNotification function with scheduling support
const createNotification = async (req, res) => {
  console.log("creating notification");
  // const admin = await Admin.findById(req.user._id);
  const admin = await Admin.findById(req.body.adminId);

  if (!admin) {
    const message = "Unauthorized user";
    res.status(400).json(message);
  }

  console.log({ adminUser: admin?._id });
  try {
    const {
      title,
      body,
      targetUsers,
      scheduleTime,
      isRecurring,
      recurrence,
      icon,
      link,
    } = req.body;
    const notification = new Notification({
      adminId: admin?._id,
      title,
      body,
      targetUsers,
      scheduleTime,
      isRecurring,
      recurrence,
      icon,
      link,
      status: scheduleTime ? "scheduled" : "pending",
    });

    await notification.save();

    // Schedule the notification if there's a schedule time
    if (scheduleTime) {
      scheduleNotification(notification);
    }

    console.log({ notification });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Initialize scheduled notifications when the server starts
const initializeScheduledNotifications = async () => {
  const scheduledNotifications = await Notification.find({
    status: "scheduled",
  });
  scheduledNotifications.forEach(scheduleNotification);
};

// Call this function when your server starts
initializeScheduledNotifications();

// Create a new notification
const createSingleNotification = async (req, res) => {
  try {
    const { title, body, targetUsers, icon, link } = req.body;
    const notification = new Notification({
      title,
      body,
      targetUsers,
      icon,
      link,
    });
    await notification.save();
    res.status(201).json(notification);
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
      icon: notification.icon || "",
      link: notification.icon || frontend,
    });

    console.log({ payload });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription && user.pushSubscription.endpoint) {
        const subscription = user.pushSubscription;

        // push.send(subscription, payload, (err, result) => {
        //   if (err) {
        //     console.log({ pushError: err });
        //   } else {
        //     console.log({ pushResponse: result });
        //   }
        // });
        // Send the notification
        webpush
          .sendNotification(subscription, payload)
          .then(() =>
            console.log({
              success: true,
              message: "Notification sent successfully",
            })
          )
          .catch((error) => {
            console.error("Error sending notification", error);
            console.log({ success: false, message: "Notification failed" });
          });
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

const sendTargetGroupNotification = async (req, res) => {
  const { id, days } = req.body;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    const users = await notificationTargetGroup(days);

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || "",
      link: notification.icon || frontend,
    });

    console.log({ payload });

    const userPushPromises = users.map(async (user) => {
      if (user.pushSubscription && user.pushSubscription.endpoint) {
        const subscription = user.pushSubscription;

        // push.send(subscription, payload, (err, result) => {
        //   if (err) {
        //     console.log({ pushError: err });
        //   } else {
        //     console.log({ pushResponse: result });
        //   }
        // });
        // Send the notification
        webpush
          .sendNotification(subscription, payload)
          .then(() =>
            console.log({
              success: true,
              message: "Notification sent successfully",
            })
          )
          .catch((error) => {
            console.error("Error sending notification", error);
            console.log({ success: false, message: "Notification failed" });
          });
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

const getNotificationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const subscribeUser1 = async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    console.log({ content: req.body });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.pushSubscription) {
      console.log("user has subscription");
      // user had previously subscribed, then update the subscription information
      user.pushSubscription = subscription;
      const updatedUser = await user.save();
      //==========={Start: For testing only }=========================
      // const payload = {
      //   title: "Notification from 1xBet",
      //   body: "Thank you for subscribing with us",
      //   // icon: "https://firebase.google.com/images/social.png",
      //   link: `${frontend}`,
      // };
      const payload = JSON.stringify({
        title: data.title || "Push title",
        body: data.body || "Additional text with some description",
        icon:
          data.icon ||
          "https://andreinwald.github.io/webpush-ios-example/images/favicon.png",
        image:
          data.image ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
        data: data.data || {
          url: "https://andreinwald.github.io/webpush-ios-example/?page=success",
          link: "https://andreinwald.github.io/webpush-ios-example/?page=success",
          message_id: "your_internal_unique_message_id_for_tracking",
        },
      });
      console.log({ payload });
      webpush
        .sendNotification(subscription, payload)
        .then(() =>
          res.status(200).json({
            success: true,
            message: "Notification sent successfully",
          })
        )
        .catch((error) => {
          console.error("Error sending notification", error);
          res
            .status(500)
            .json({ success: false, message: "Notification failed" });
        });
      // if (updatedUser) {
      //   webpush
      //     .sendNotification(subscription, payload)
      //     .then(() =>
      //       res
      //         .status(200)
      //         .json({
      //           success: true,
      //           message: "Notification sent successfully",
      //         })
      //     )
      //     .catch((error) => {
      //       console.error("Error sending notification", error);
      //       res
      //         .status(500)
      //         .json({ success: false, message: "Notification failed" });
      //     });
      // }
      //==========={End: For testing only }=========================
      res
        .status(200)
        .json({ message: "User already subscribed to push notifications" });
    } else {
      // add new user subscription
      user.pushSubscription = subscription;
      const updatedUser = await user.save();

      const payload = {
        title: "Notification from 1xBet",
        body: "Thank you for subscribing",
        // icon: "https://firebase.google.com/images/social.png",
        link: `${frontend}`,
      };
      console.log({ payload });
      if (updatedUser) {
        // push.send(subscription, payload, (err, result) => {
        //   if (err) {
        //     console.log({ pushError: err });
        //   } else {
        //     console.log({ pushResponse: result });
        //   }
        // });
        // Send the notification
        webpush
          .sendNotification(subscription, payload)
          .then(() =>
            console.log({
              success: true,
              message: "Notification sent successfully",
            })
          )
          .catch((error) => {
            console.error("Error sending notification", error);
            console.log({ success: false, message: "Notification failed" });
          });
      }
      console.log({ message: "User subscribed to push notifications" });
      res
        .status(200)
        .json({ message: "User subscribed to push notifications" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subscribeUser2 = async (req, res) => {
  const { userId, subscription } = req.body;

  console.log({ content: req.body });

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log({ user: user?._id });
  console.log({ subscription });

  const payload = JSON.stringify({
    title: "Push title",
    body: "Additional text with some description",
    icon: "https://andreinwald.github.io/webpush-ios-example/images/favicon.png",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
    data: {
      url: "https://andreinwald.github.io/webpush-ios-example/?page=success",
      link: "https://andreinwald.github.io/webpush-ios-example/?page=success",
      message_id: "your_internal_unique_message_id_for_tracking",
    },
  });

  console.log({ payload });

  // Send the notification
  webpush
    .sendNotification(subscription, payload)
    .then(() =>
      res
        .status(200)
        .json({ success: true, message: "Notification sent successfully" })
    )
    .catch((error) => {
      console.error("Error sending notification", error);
      res.status(500).json({ success: false, message: "Notification failed" });
    });
};

// Subscribe user to push notifications
const subscribeUserOriginal = async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    console.log({ content: req.body });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.pushSubscription) {
      // user had previously subscribed, then update the subscription information
      user.pushSubscription = subscription;
      const updatedUser = await user.save();
      res
        .status(200)
        .json({ message: "User already subscribed to push notifications" });
    } else {
      // add new user subscription
      user.pushSubscription = subscription;
      const updatedUser = await user.save();

      const payload = {
        title: "Notification from 1xBet",
        body: "Thank you for subscribing",
        // icon: "https://firebase.google.com/images/social.png",
        url: `${frontend}`,
      };
      console.log({ payload });
      if (updatedUser) {
        // push.send(subscription, payload, (err, result) => {
        //   if (err) {
        //     console.log({ pushError: err });
        //   } else {
        //     console.log({ pushResponse: result });
        //   }
        // });
        // Send the notification
        webpush
          .sendNotification(subscription, payload)
          .then(() =>
            console.log({
              success: true,
              message: "Notification sent successfully",
            })
          )
          .catch((error) => {
            console.error("Error sending notification", error);
            console.log({ success: false, message: "Notification failed" });
          });
      }
      console.log({ message: "User subscribed to push notifications" });
      res
        .status(200)
        .json({ message: "User subscribed to push notifications" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subscribeUser = async (req, res) => {
  const { userId, subscription } = req.body;

  console.log({ content: req.body });

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // add new user subscription
  user.pushSubscription = subscription;
  const updatedUser = await user.save();

  const payload = JSON.stringify({
    title: "Notification from 1xBet",
    body: "Thank you for subscribing",
    // icon: "https://firebase.google.com/images/social.png",
    data: {
      url: `${frontend}`,
      link: `${frontend}`,
      // message_id: "your_internal_unique_message_id_for_tracking",
    },
  });
  console.log({ payload });
  if (updatedUser) {
    // Send the notification
    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully" });
  } else {
    // add new user subscription
    user.pushSubscription = subscription;
    const updatedUser = await user.save();
    if (updatedUser) {
      // Send the notification
      res
        .status(200)
        .json({ success: true, message: "Notification sent successfully" });
    }
  }
};

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
    user.pushSubscription.subscription = null;
    await user.save();
    console.log({ message: "User unsubscribed from push notifications" });
    res
      .status(200)
      .json({ message: "User unsubscribed from push notifications" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsubscribeUserInternal = async (res) => {
  try {
    const userId = "66987f1e0469a1183bdda1fd";

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log({ message: "User not found" });
    }

    // Remove user's push subscription
    user.pushSubscription.subscription = null;
    const updatedUser = await user.save();
    if (updatedUser) {
      console.log({ message: "User unsubscribed from push notifications" });
      console.log({ updatedUser });
    }
  } catch (error) {
    console.log({ message: error.message });
  }
};

// unsubscribeUserInternal()

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
        icon:
          notification.icon || "https://firebase.google.com/images/social.png",
        link: notification.icon || frontend,
      });

      console.log({ payload });
      // Send 201 - resource created
      const userPushPromises = users.map(async (user) => {
        if (user.pushSubscription && user.pushSubscription.endpoint) {
          const subscription = user.pushSubscription;

          // push.send(subscription, payload, (err, result) => {
          //   if (err) {
          //     console.log({ pushError: err });
          //   } else {
          //     console.log({ pushResponse: result });
          //   }
          // });
          // Send the notification
          webpush
            .sendNotification(subscription, payload)
            .then(() =>
              console.log({
                success: true,
                message: "Notification sent successfully",
              })
            )
            .catch((error) => {
              console.error("Error sending notification", error);
              console.log({ success: false, message: "Notification failed" });
            });
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

const notificationTargetGroup = async (days) => {
  const users = await User.find();
  let targetUsers = [];

  let today = new Date();
  console.log({ today });

  for (const user of users) {
    let lastLogin = user.lastLogin;

    const differenceInDays = await timeDifference(today, lastLogin);
    // last seen greater than "days"
    // if (differenceInDays > days) {
    //   targetUsers.push(user);
    // }

    // last seen less than "days"
    if (differenceInDays < days) {
      targetUsers.push(user);
    }
  }
  console.log({ targetUsers });
  return targetUsers; // Return the array after processing all users
};

// notificationTargetGroup(30)

const oneWeekAgoGroup = async (req, res) => {
  const { appId } = req.body; // required appId to fetch app users
  const pwa = await Pwa.findById(appId);
  // check if the PWA exists
  if (!pwa) {
    return res.status(404).json({ message: "Pwa event not found" });
  }
  // fetch all users that are using the PWA app
  const users = await User.find({ appId: appId }); // all users with the same appId

  let oneWeekAgo = [];

  let today = new Date();
  console.log({ today });

  for (const user of users) {
    let lastLogin = user.lastLogin;

    const differenceInDays = await timeDifference(today, lastLogin);

    if (differenceInDays > 7) {
      oneWeekAgo.push(user);
    }
  }
  console.log({ response: oneWeekAgo });
  return oneWeekAgo; // Return the array after processing all users
};
//next step, add notification id and send directly or use playerId directly
// oneWeekAgoGroup()

// getOneWeekAgo()

async function timeDifference(timeNow, lastLogin) {
  // const timeNow = "2024-11-04T15:52:50.933Z";
  // const lastLogin = "2024-09-30T14:18:36.089Z";

  const dateNow = new Date(timeNow);
  const dateLastLogin = new Date(lastLogin);

  const differenceInMilliseconds = dateNow - dateLastLogin;

  // console.log({ dateNow, dateLastLogin, differenceInMilliseconds });

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  console.log(differenceInDays);

  //3029654844

  return differenceInDays;
}

// timeDifference()

const sendOneSignalNotificationMain = async (req, res) => {
  const { appId } = req.params;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  const headings1 = {
    ar: "Title", // Arabic required,
    "zh-Hans": "Title", // Chinese
    nl: "Title", // Dutch,
    // de: "Title", // German (if necessary),
    en: "Title", // english required,
    fr: "Title", //French
    id: "Title", // Indonesian,
    fa: "Title", // urdu, //
    ko: "Title", // Korean,
    ru: "Title", // Russian,
    tr: "Title", // Turkish,
    ms: "Title", // Malay,
  };

  const subtitle1 = {
    ar: "Sub Title", // Arabic required,
    "zh-Hans": "Sub Title", // Chinese
    nl: "Sub Title", // Dutch,
    // de: "Sub Title", // German (if necessary),
    en: "Sub Title", // english required,
    fr: "Sub Title", //French
    id: "Sub Title", // Indonesian,
    fa: "Sub Title", // urdu, //
    ko: "Sub Title", // Korean,
    ru: "Sub Title", // Russian,
    tr: "Sub Title", // Turkish,
    ms: "Sub Title", // Malay,
  };

  const contents1 = {
    ar: "Hello, world", // Arabic required,
    "zh-Hans": "你好世界", // Chinese
    nl: "Hello, world", // Dutch,
    // de: "Hello, world", // German (if necessary),
    en: "Hello, world", // english required,
    fr: "Bonjour le monde", //French
    id: "Hello, world", // Indonesian,
    fa: "Hello, world", // urdu, //
    ko: "Hello, world", // Korean,
    ru: "Hello, world", // Russian,
    tr: "Hello, world", // Turkish,
    ms: "Hello, world", // Malay,
  };

  const headings = { en: "English Title" };
  const contents = { en: "English Message" };
  const data = {
    target_channel: "push",
    // included_segments: ["Subscribed Users"], // all users or selected users
    included_segments: ["All"],
    app_id: one_signal_app_id,
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`, // Replace with your actual OneSignal API key
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};

// sendOneSignalNotification()

const sendOneSignalNotification = async (req, res) => {
  const { appId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  const headings = {
    ar: "Title", // Arabic required,
    "zh-Hans": "Title", // Chinese
    nl: "Title", // Dutch,
    // de: "Title", // German (if necessary),
    en: "Title", // english required,
    fr: "Title", //French
    id: "Title", // Indonesian,
    fa: "Title", // urdu, //
    ko: "Title", // Korean,
    ru: "Title", // Russian,
    tr: "Title", // Turkish,
    ms: "Title", // Malay,
  };

  const contents = {
    ar: "Hello, world", // Arabic required,
    "zh-Hans": "你好世界", // Chinese
    nl: "Hello, world", // Dutch,
    // de: "Hello, world", // German (if necessary),
    en: "Hello, world", // english required,
    fr: "Bonjour le monde", //French
    id: "Hello, world", // Indonesian,
    fa: "Hello, world", // urdu, //
    ko: "Hello, world", // Korean,
    ru: "Hello, world", // Russian,
    tr: "Hello, world", // Turkish,
    ms: "Hello, world", // Malay,
  };

  const data = {
    target_channel: "push",
    // included_segments: ["Subscribed Users"], // all users or selected users
    included_segments: ["All"],
    app_id: one_signal_app_id,
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`, // Replace with your actual OneSignal API key
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};

//This is a sample subscription object stored in user.pushSubscription

//Now we can map users by country and send dedicated messages to users from selected countries and work with their specific time zones
/**
 Examples
 1. localized messages to users by country at 10:00Am their local time
 2. Special bonus to users in specific countries
 * 
 */
//
const subscription = {
  playerId: "0cdc6460-9aa6-4d16-ba76-3f7f04dbdc92",
  deviceToken:
    "https://fcm.googleapis.com/fcm/send/e693H_dVdsA:APA91bHuEDeX0q-5Lniuv6FA_1OYn19uQCzY7-8JvI9PWZBze2Akuo2K1xyKLxuotoC64NMyVtCav-hM2Ih1FusVY6W1CcXL_nW3k2BX2FDoOgIRn7eR7CkwhuU3O5S3t9SrQaWDwLgM",
  optedIn: true,
  country: "Russia",
};

//====================================================={ONE SIGNALS NOTIFICATIONS}====================================================================
// const playerId = "0cdc6460-9aa6-4d16-ba76-3f7f04dbdc92"; // imac
const playerId = "463f80f5-cdbe-407b-a298-bd7cd2769f51"; // iphone
// const playerId = "cba03428-0a46-4c43-ad1f-a55ba66a8302"; // android
//
//
//====================================================={BONUS}====================================================================

const sendBonusNotificationByCountry = async (req, res) => {
  const { appId, userCountry } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;
  let contents;

  // Set content based on the user's country
  switch (userCountry) {
    case "MY": // Malaysia
      contents = {
        ar: "لقد حصلت على مكافأة قدرها 300 MYR", // Arabic
        "zh-Hans": "您刚刚赚取了300 MYR的奖金", // Chinese
        nl: "Je hebt zojuist een bonus van 300 MYR verdiend", // Dutch
        en: "You just earned a bonus of 300 MYR", // English
        fr: "Vous venez de gagner un bonus de 300 MYR", // French
        id: "Anda baru saja mendapatkan bonus 300 MYR", // Indonesian
        fa: "شما به تازگی 300 MYR پاداش دریافت کرده‌اید", // Urdu
        ko: "방금 300 MYR 보너스를 받았습니다", // Korean
        ru: "Вы только что получили бонус 300 MYR", // Russian
        tr: "Az önce 300 MYR bonus kazandınız", // Turkish
        ms: "Anda baru sahaja menerima bonus 300 MYR", // Malay
      };
      break;
    case "EG": // Egypt
      contents = {
        ar: "لقد حصلت على مكافأة قدرها 3000 EGP", // Arabic
        "zh-Hans": "您刚刚赚取了3000 EGP的奖金", // Chinese
        nl: "Je hebt zojuist een bonus van 3000 EGP verdiend", // Dutch
        en: "You just earned a bonus of 3000 EGP", // English
        fr: "Vous venez de gagner un bonus de 3000 EGP", // French
        id: "Anda baru saja mendapatkan bonus 3000 EGP", // Indonesian
        fa: "شما به تازگی 3000 EGP پاداش دریافت کرده‌اید", // Urdu
        ko: "방금 3000 EGP 보너스를 받았습니다", // Korean
        ru: "Вы только что получили бонус 3000 EGP", // Russian
        tr: "Az önce 3000 EGP bonus kazandınız", // Turkish
        ms: "Anda baru sahaja menerima bonus 3000 EGP", // Malay
      };
      break;
    case "RU": // Russia
      contents = {
        ar: "لقد حصلت على مكافأة قدرها 5000 RUB", // Arabic
        "zh-Hans": "您刚刚赚取了5000 RUB的奖金", // Chinese
        nl: "Je hebt zojuist een bonus van 5000 RUB verdiend", // Dutch
        en: "You just earned a bonus of 5000 RUB", // English
        fr: "Vous venez de gagner un bonus de 5000 RUB", // French
        id: "Anda baru saja mendapatkan bonus 5000 RUB", // Indonesian
        fa: "شما به تازگی 5000 RUB پاداش دریافت کرده‌اید", // Urdu
        ko: "방금 5000 RUB 보너스를 받았습니다", // Korean
        ru: "Вы только что получили бонус 5000 RUB", // Russian
        tr: "Az önce 5000 RUB bonus kazandınız", // Turkish
        ms: "Anda baru sahaja menerima bonus 5000 RUB", // Malay
      };
      break;
    default:
      contents = {
        ar: "لقد حصلت على مكافأة قدرها 50USD", // Arabic
        "zh-Hans": "您刚刚赚取了50USD的奖金", // Chinese
        nl: "Je hebt zojuist een bonus van 50USD verdiend", // Dutch
        en: "You just earned a bonus of 50 USD", // English
        fr: "Vous venez de gagner un bonus de 50 USD", // French
        id: "Anda baru saja mendapatkan bonus 50 USD", // Indonesian
        fa: "شما به تازگی 50 USD پاداش دریافت کرده‌اید", // Urdu
        ko: "방금 50 USD 보너스를 받았습니다", // Korean
        ru: "Вы только что получили бонус 50 USD", // Russian
        tr: "Az önce 50 USD bonus kazandınız", // Turkish
        ms: "Anda baru sahaja menerima bonus 50 USD", // Malay
      };
  }

  const headings = {
    ar: "مكافأة", // Arabic
    "zh-Hans": "奖励", // Chinese
    nl: "Bonus", // Dutch
    en: "Bonus", // English
    fr: "Bonus", // French
    id: "Bonus", // Indonesian
    fa: "پاداش", // Urdu
    ko: "보너스", // Korean
    ru: "Бонус", // Russian
    tr: "Bonus", // Turkish
    ms: "Bonus", // Malay
  };

  const data = {
    target_channel: "push",
    included_segments: ["All"],
    // include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    app_id: one_signal_app_id,
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`,
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};
// sendBonusNotificationByCountry('MY'); // For Malaysia
// sendBonusNotificationByCountry('EG'); // For Egypt
// sendBonusNotificationByCountry('RU'); // For Russia
// sendBonusNotificationByCountry('US'); // For the default case (50 USD)

//====================================================={Registration}====================================================================

const sendRegistrationNotification1 = async (req, res) => {
  const { appId, playerId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  const headings = {
    ar: "تم التسجيل بنجاح", // Arabic
    "zh-Hans": "注册成功", // Chinese
    nl: "Registratie voltooid", // Dutch
    en: "Registration Successful", // English
    fr: "Inscription réussie", // French
    id: "Pendaftaran berhasil", // Indonesian
    fa: "ثبت نام موفقیت‌آمیز بود", // Urdu
    ko: "등록 완료", // Korean
    ru: "Регистрация успешна", // Russian
    tr: "Kayıt Başarılı", // Turkish
    ms: "Pendaftaran Berjaya", // Malay
  };

  const contents = {
    ar: "أنت الآن جزء من عائلتنا! أهلاً بك!", // Arabic
    "zh-Hans": "您现在是我们大家庭的一部分！欢迎！", // Chinese
    nl: "Je maakt nu deel uit van onze familie! Welkom!", // Dutch
    en: "You're now part of our family! Welcome!", // English
    fr: "Vous faites maintenant partie de notre famille! Bienvenue!", // French
    id: "Sekarang Anda menjadi bagian dari keluarga kami! Selamat datang!", // Indonesian
    fa: "شما اکنون بخشی از خانواده ما هستید! خوش آمدید!", // Urdu
    ko: "이제 우리 가족의 일원이 되었습니다! 환영합니다!", // Korean
    ru: "Теперь вы часть нашей семьи! Добро пожаловать!", // Russian
    tr: "Artık ailemizin bir parçasısınız! Hoş geldiniz!", // Turkish
    ms: "Anda kini sebahagian daripada keluarga kami! Selamat datang!", // Malay
  };

  const data = {
    target_channel: "push",
    app_id: one_signal_app_id,
    include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`,
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};

const sendRegistrationNotification = async (req, res) => {
  const { appId, playerId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  console.log({ pwa });

  console.log({ playerId, one_signal_api_key, one_signal_api_key });

  const headings = {
    ar: "تم التسجيل بنجاح", // Arabic
    "zh-Hans": "注册成功", // Chinese
    nl: "Registratie voltooid", // Dutch
    en: "Registration Successful", // English
    fr: "Inscription réussie", // French
    id: "Pendaftaran berhasil", // Indonesian
    fa: "ثبت نام موفقیت‌آمیز بود", // Urdu
    ko: "등록 완료", // Korean
    ru: "Регистрация успешна", // Russian
    tr: "Kayıt Başarılı", // Turkish
    ms: "Pendaftaran Berjaya", // Malay
  };

  const contents = {
    ar: "أنت الآن جزء من عائلتنا! أهلاً بك!", // Arabic
    "zh-Hans": "您现在是我们大家庭的一部分！欢迎！", // Chinese
    nl: "Je maakt nu deel uit van onze familie! Welkom!", // Dutch
    en: "You're now part of our family! Welcome!", // English
    fr: "Vous faites maintenant partie de notre famille! Bienvenue!", // French
    id: "Sekarang Anda menjadi bagian dari keluarga kami! Selamat datang!", // Indonesian
    fa: "شما اکنون بخشی از خانواده ما هستید! خوش آمدید!", // Urdu
    ko: "이제 우리 가족의 일원이 되었습니다! 환영합니다!", // Korean
    ru: "Теперь вы часть нашей семьи! Добро пожаловать!", // Russian
    tr: "Artık ailemizin bir parçasısınız! Hoş geldiniz!", // Turkish
    ms: "Anda kini sebahagian daripada keluarga kami! Selamat datang!", // Malay
  };

  const data = {
    target_channel: "push",
    app_id: one_signal_app_id,
    include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`,
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};
// sendRegistrationNotification(playerId)
//====================================================={Purchase}====================================================================
//====================================================={Purchase to User}====================================================================
//Good
const sendPurchaseNotification = async (req, res) => {
  const { appId, playerId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  const headings = {
    ar: "شراء ناجح", // Arabic
    "zh-Hans": "购买成功", // Chinese
    nl: "Aankoop geslaagd", // Dutch
    en: "Purchase Successful", // English
    fr: "Achat réussi", // French
    id: "Pembelian berhasil", // Indonesian
    fa: "خرید موفقیت‌آمیز", // Urdu
    ko: "구매 성공", // Korean
    ru: "Покупка успешна", // Russian
    tr: "Satın Alma Başarılı", // Turkish
    ms: "Pembelian Berjaya", // Malay
  };

  const contents = {
    ar: "مبروك! لقد قمت بأول إيداع لك. الآن دعنا نبدأ المرح!", // Arabic
    "zh-Hans": "恭喜！您已完成首次存款。现在让我们开始吧！", // Chinese
    nl: "Gefeliciteerd! Je hebt je eerste storting gedaan. Laat het plezier beginnen!", // Dutch
    en: "Congratulations! You have made your first deposit. Now let the fun begin!", // English
    fr: "Félicitations! Vous avez effectué votre premier dépôt. Maintenant, que le plaisir commence!", // French
    id: "Selamat! Anda telah melakukan deposit pertama Anda. Sekarang mari kita mulai bersenang-senang!", // Indonesian
    fa: "تبریک! شما اولین واریز خود را انجام داده‌اید. حالا بگذارید سرگرمی شروع شود!", // Urdu
    ko: "축하합니다! 첫 입금을 완료했습니다. 이제 재미가 시작됩니다!", // Korean
    ru: "Поздравляем! Вы сделали свой первый депозит. Теперь начинается веселье!", // Russian
    tr: "Tebrikler! İlk deponuzu yaptınız. Şimdi eğlence başlasın!", // Turkish
    ms: "Tahniah! Anda telah membuat deposit pertama anda. Sekarang mari kita mulakan keseronokan!", // Malay
  };

  const data = {
    target_channel: "push",
    app_id: one_signal_app_id,
    include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`, // Replace with your actual OneSignal API Key
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;

      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};

// Example usage:
// Assuming you retrieved the player_id from your database for a particular user
// const playerId = "b69f47b9-fc09-436b-a228-ef06a6d9153f"; // OneSignal's player_id for the user

//
// sendPurchaseNotification(playerId);

//====================================================={app install}====================================================================
//Good
const sendInstallNotification = async (req, res) => {
  const { appId, playerId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  const headings = {
    ar: "تثبيت التطبيق", // Arabic
    "zh-Hans": "应用安装", // Chinese
    nl: "App installatie", // Dutch
    en: "App Installed", // English
    fr: "Application installée", // French
    id: "Aplikasi terpasang", // Indonesian
    fa: "نصب اپلیکیشن", // Urdu
    ko: "앱 설치됨", // Korean
    ru: "Приложение установлено", // Russian
    tr: "Uygulama Yüklendi", // Turkish
    ms: "Aplikasi Dipasang", // Malay
  };

  const contents = {
    ar: "لقد قمت بتثبيت التطبيق بنجاح!", // Arabic
    "zh-Hans": "您已成功安装应用!", // Chinese
    nl: "Je hebt de app succesvol geïnstalleerd!", // Dutch
    en: "You have successfully installed the app!", // English
    fr: "Vous avez installé l'application avec succès!", // French
    id: "Anda telah berhasil menginstal aplikasi!", // Indonesian
    fa: "شما اپلیکیشن را با موفقیت نصب کردید!", // Urdu
    ko: "앱을 성공적으로 설치했습니다!", // Korean
    ru: "Вы успешно установили приложение!", // Russian
    tr: "Uygulamayı başarıyla yüklediniz!", // Turkish
    ms: "Anda telah berjaya memasang aplikasi!", // Malay
  };

  const data = {
    target_channel: "push",
    app_id: one_signal_app_id,
    include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    headings,
    contents,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`,
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
      const id = response.data?.id;
      if (id) {
        const result = {
          id,
        };
        res.status(200).json(result);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
};
// sendInstallNotification(playerId);
//====================================================={Daily notifications}====================================================================

// List of countries and their time zones
const countryTimeZones = {
  EG: "Africa/Cairo", // Egypt
  DE: "Europe/Berlin", // Germany
  HK: "Asia/Hong_Kong", // Hong Kong
  CN: "Asia/Shanghai", // China
  ID: "Asia/Jakarta", // Indonesia
  MY: "Asia/Kuala_Lumpur", // Malaysia
  PK: "Asia/Karachi", // Pakistan
  RU: "Europe/Moscow", // Russia
  SA: "Asia/Riyadh", // Saudi Arabia
  SN: "Africa/Dakar", // Senegal
  SG: "Asia/Singapore", // Singapore
  KR: "Asia/Seoul", // South Korea
  TR: "Europe/Istanbul", // Turkey
  IQ: "Asia/Baghdad", // Iraq
};
//Good
// Function to send the daily notification based on the country
const sendDailyNotificationToAllCountries = async (req, res) => {
  const { appId, playerId } = req.body;
  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  if (!pwa.oneSignalApiKey) {
    return res.status(404).json({ message: "Pwa notification not enabled" });
  }
  const one_signal_api_key = pwa.oneSignalApiKey;
  const one_signal_app_id = pwa.oneSignalAppId;

  // const utcTime = "10:00"; // UTC time for 10:00 AM
  const utcTime = "07:00"; // UTC time for 07:00 AM

  for (const [countryCode, timeZone] of Object.entries(countryTimeZones)) {
    // Convert 10:00 AM UTC to the local time for each country
    const localTime = moment.tz(utcTime, "HH:mm", "UTC").tz(timeZone);
    const sendTime = localTime.format(); // Get the time in ISO 8601 format

    // Schedule cron job to send the notification at the calculated local time
    cron.schedule(`${localTime.minutes()} ${localTime.hours()} * * *`, () => {
      console.log(
        `Sending "Good morning" notification to ${countryCode} at local time: ${sendTime}`
      );
      sendBonusNotification(countryCode, one_signal_api_key, one_signal_app_id); // Send the same notification to all countries
    });
  }
};

// Function to send the bonus notification (same content for all)
const sendBonusNotification = async (
  userCountry,
  one_signal_api_key,
  one_signal_app_id
) => {
  // Content to send (same for all countries, translated)

  const headings = {
    ar: "صباح الخير", // Arabic
    "zh-Hans": "早安", // Chinese
    nl: "Goedemorgen", // Dutch
    en: "Good morning", // English
    fr: "Bonjour", // French
    id: "Selamat pagi", // Indonesian
    fa: "صبح بخیر", // Persian (Farsi)
    ko: "좋은 아침", // Korean
    ru: "Доброе утро", // Russian
    tr: "Günaydın", // Turkish
    ms: "Selamat pagi", // Malay
  };

  const contents = {
    ar: "مرحبًا بك في يوم جديد ومثير!", // Arabic
    "zh-Hans": "欢迎来到全新激动人心的一天！", // Chinese
    nl: "Welkom bij een nieuwe en opwindende dag!", // Dutch
    en: "Welcome to a new and exciting day!", // English
    fr: "Bienvenue dans un nouveau et excitant jour!", // French
    id: "Selamat datang di hari baru yang menyenangkan!", // Indonesian
    fa: "به یک روز جدید و هیجان انگیز خوش آمدید!", // Persian (Farsi)
    ko: "새롭고 신나는 하루가 시작되었습니다!", // Korean
    ru: "Добро пожаловать в новый захватывающий день!", // Russian
    tr: "Yeni ve heyecan verici bir güne hoş geldiniz!", // Turkish
    ms: "Selamat datang ke hari baru yang menarik!", // Malay
  };
  const data = {
    app_id: one_signal_app_id, // Your OneSignal App ID
    include_segments: ["All"], // Send to all subscribers
    // include_player_ids: [playerId], // Sending the notification to the specific user using their player_id
    headings, // Translated heading (Good morning)
    contents, // Translated content (Welcome to a new and exciting day)
    content_available: true,
    small_icon: "ic_notification_icon", // Optional: Small icon for the notification
    data: {
      PushTitle: "Scheduled Notification",
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${one_signal_api_key}`, // Replace with your OneSignal API Key
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );

    if (response?.data) {
      console.log("Notification sent successfully:", response.data);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Start the process of sending daily notifications
// sendDailyNotificationToAllCountries();

/*

 Notifications
 1. Install
 2. Lead
 3. Purchase
 4. Bonus
 5. Daily 
 
 */

//====================================================={ONE SIGNALS NOTIFICATIONS}====================================================================

module.exports = {
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
  oneWeekAgoGroup,
  sendOneSignalNotificationMain,
  sendOneSignalNotification,
  sendBonusNotificationByCountry,
  sendRegistrationNotification,
  sendPurchaseNotification,
  sendInstallNotification,
  sendDailyNotificationToAllCountries,
};

//endpoint1: https://fcm.googleapis.com/fcm/send/f-1gez1jkcI:APA91bErUS1ipYItBeMjlYY43ew4AOUVuK2p57KXPKFIUcP0nn-iDazY_ERTQeiAN6epwXqbltyhrtwvYL5C3fpDuZh2B8rG9pS7vPNR0UJdHdIalhP6ZXEKkqzxg3ky8xTNtgkdZ-XM
//endpoint2:
