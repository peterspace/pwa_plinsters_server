const axios = require("axios");

const one_signal_api_key ="os_v2_app_z7spz3q4avemxginhgnidbwythl7fbfhleqekjeb3z63z7zlpbidv5mwmdlqf2vv6a7ijol5sxbanfe777ke4wnhzcxx7fx4lzzrnii"
const one_signal_app_id = process.env.ONE_SIGNAL_APP_ID;

const sendNotification = async () => {
  const data = {
    target_channel: "push",
    included_segments: ["Subscribed Users"],
    app_id: "202d4f61-1ca9-42df-9d36-bb17d8123abc",
    contents: {
      en: "Hello, world",
      es: "Hola mundo",
      fr: "Bonjour le monde",
      "zh-Hans": "你好世界",
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic MjAyYzJlOTAtMTY4Mi00ODFlLTg2MDYtZTM2YzllM2ZlZTVi", // Replace with your actual OneSignal API key
  };

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      data,
      { headers }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

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

const subtitle = {
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

// Call the function to send the notification
// sendNotification();

const sendNotification1 = async () => {
  const data = {
    target_channel: "push",
    included_segments: ["Subscribed Users"], // all users or selected users
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
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
