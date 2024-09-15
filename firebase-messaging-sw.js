// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyDkMGuup8yK-uCXegZe7QFST9_jnAmHicg",
//   authDomain: "pushnotifications-42d10.firebaseapp.com",
//   projectId: "pushnotifications-42d10",
//   storageBucket: "pushnotifications-42d10.appspot.com",
//   messagingSenderId: "821074541325",
//   appId: "1:821074541325:web:125bfba596913f18740e44",
//   measurementId: "G-N9KJZKE9BH",
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = getMessaging(firebaseApp);

// // const messaging = getMessaging();
// onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// // onBackgroundMessage(messaging, (payload) => {
// //   console.log(
// //     "[firebase-messaging-sw.js] Received background message ",
// //     payload
// //   );
// //   // Customize notification here
// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     icon: "/pwa-192x192.png", // Your icon
// //     //   badge: "pwa-64x64.png", // Badge icon
// //   };

// //   self.registration.showNotification(notificationTitle, notificationOptions);
// // });
