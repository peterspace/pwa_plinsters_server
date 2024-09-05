const webPush = require("web-push");
const dotenv = require("dotenv").config();

//============{VAPID KEY}=================================
// {
//     "subject": "mailto: <peter.space.io@gmail.com>",
//     "publicKey": "BNyuJtC68awHeNgFpSAZfU8TiD6frUMDn9DGFu_HSP3LPdMV8hJm1cTQU3_wZyoRuDXWwgJ1K_nzIM7MBsrfHuk",
//     "privateKey": "O_jq0iMjQd1kOGnB0Qmy8ckIwycMf9fxp7vnrGQ-xTc"
//     }

// VAPID keys should be generated only once.
// const vapidKeys = {
//   publicKey: '<YOUR_PUBLIC_VAPID_KEY>',
//   privateKey: '<YOUR_PRIVATE_VAPID_KEY>',
// };

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
  //   'mailto:peter.space.io@gmail.com',
  `mailto:${process.env.VAPID_EMAIL}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send push notification
const sendPushNotification = (subscription, data) => {
  webPush
    .sendNotification(subscription, JSON.stringify(data))
    .then((response) => console.log("Notification sent:", response))
    .catch((err) => console.error("Error sending notification", err));
};

module.exports = { sendPushNotification };
