const dotenv = require("dotenv").config();
const https = require("https"); // new
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const axios = require("axios");
var geoip = require("geoip-country");

const { errorHandler } = require("./middleware/errorMiddleware.js");
const cookieParser = require("cookie-parser");
const path = require("path");
//==========={using clodinary}===================
const { uploadImage } = require("./utils/uploadImage.js");
const { getCountryCode } = require("./countryCodes.js");
const { createPurchaseEvent } = require("./controllers/purchaseControllers.js");
const { createLeadEvent } = require("./controllers/leadControllers.js");
const User = require("./models/User.js");
const leadRoutes = require("./routes/lead.js");
const purchaseRoutes = require("./routes/purchase.js");
const notificationRoutes = require("./routes/notification.js");

const userRoutes = require("./routes/user.js");
const pwaRoutes = require("./routes/pwa.js");
const { rateLimit } = require("express-rate-limit");
// cron job for periodic notification
require("./jobs/scheduleNotifications.js");

const PORT = process.env.PORT || 5000;
const keitaro_first_campaign = process.env.KEITARO_FIRST_CAMPAIGN; // for selecting country
const white_page = process.env.WHITE_PAGE_LINK;
const black_page = process.env.BLACK_PAGE_LINK;
const campaignStatus = process.env.CAMPAIGN_STATUS;
const defaultRequestURL = process.env.DEFAULT_REQUEST_URL;
const backend = process.env.BACKEND_URL;
const frontend = process.env.FRONTEND_URL;
const defaultAppId = process.env.DEFAULT_APP_ID;
// List of supported countries
// Convert the comma-separated string from the environment variable to an array
const supportedCountries = process.env.SUPPORTED_COUNTRIES.split(",");
console.log({ campaignStatus });

//ip rate limit
// const limiter = rateLimit({
//   // windowMs: 15 * 60 * 1000, // 15 minutes
//   windowMs: 1 * 60 * 1000, // 15 minutes testing
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message:"To many request from this IP. Please try again later"
// });

const limiter = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 1 * 60 * 1000, // 15 minutes testing
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "To many request from this IP. Please try again later",
});

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));
// app.use(cors());
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

// app.use(limiter);

//references
//puppeteer and onrender config with docker: https://www.youtube.com/watch?v=6cm6G78ZDmM&t=320s
// Error Middleware
// Apply the middleware to your routes

app.use(errorHandler);

// Middleware to extract the IP address
app.use((req, res, next) => {
  const clientIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  req.clientIp = clientIp;

  next();
});

// -momery unleaked---------
app.set("trust proxy", 1);

//=================={Routes}===============================================
app.use("/lead", leadRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/user", userRoutes);
app.use("/notifications", notificationRoutes);

app.use("/pwa", pwaRoutes);

//active
//suspended
//inactive

//Step1: initial path

function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

//testing purchase call from server

async function redirectAppUser(req, link1) {
  let url;

  if (campaignStatus === "inactive") {
    url = {
      link: white_page,
      page: "white",
    };
  }
  // for facebook moderation purpose
  if (campaignStatus === "paused") {
    url = {
      link: white_page,
      page: "white",
    };
  }

  // return url;
  let link = "";

  if (campaignStatus === "active") {
    try {
      // Create an HTTPS agent that ignores SSL certificate errors
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      const response = await axios.get(link1, {
        headers: req.headers, // Forward original headers if needed
        httpsAgent: agent, // Use the agent that ignores SSL errors
      });

      if (response.data) {
        link = response.data;

        if (link.startsWith("http://") || link.startsWith("https://")) {
          console.log("The string starts with 'http' or 'https'.");
          // supported country
          url = {
            link: black_page,
            page: "black",
          };
        }
      }
      // return link2;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      console.log({
        stage6: "return error 404 for unsupported region",
      });
      //unsupported country
      url = {
        link: white_page,
        page: "white",
      };
    }
  }

  return url;
}

async function getCountryByIP() {
  var ip = "207.97.227.239";
  var geo = geoip.lookup(ip);

  console.log({ countryData: geo });
}
// getCountryByIP()

async function fetchCountryCode() {
  // Example usage:
  // const countryName = "United States";
  const countryName = "Pakistan";
  const countryCode = getCountryCode(countryName);
  let hashedCountryCode = null;

  if (countryCode) {
    console.log(`Normalized format: ${countryCode}`);
    hashedCountryCode = hashData(countryCode);
    console.log(`Hashed format: ${hashedCountryCode}`);
  } else {
    console.log("Country not found");
  }
}

// fetchCountryCode()

//==================={Main Routes}========================================================

app.get("/", (req, res) => {
  const ip = req.clientIp;
  console.log({ ip });
  return res.json({
    ip,
  });
});
//======{all request to these endpoint are from the Keitaro server only}==========================

app.get("/create_facebook_purchase_event", createPurchaseEvent);
//https://www.wingsofflimits.pro/create_facebook_leads_event?fbclid={subid}&external_id={subid}&campaign_name={campaign_name}&campaign_id={campaign_id}&=true&visitor_code={visitor_code}&user_agent={user_agent}&ip={ip}&offer_id={offer_id}&os={os}&region={region}&city={city}&source={source}
app.get("/create_facebook_leads_event", createLeadEvent);

// fetch all users
app.get("/all_users", async (req, res) => {
  const allUsers = await User.find();

  if (allUsers) {
    console.log({ allUsers });
    res.status(200).json(allUsers);
  }
});

//======{new}===============================
app.post("/register1", async (req, res) => {
  console.log("calling register endpoint");

  const { id, user_id, device } = req.body;
  const ip = req.clientIp;
  console.log({ userIPAddress: ip });
  console.log({ userData: req.body });

  let referralLink = id ? `/?${id}` : null;
  // Allow multiple registration with same ip with different devices or browsers and for different ips
  try {
    // Priority 1: Check if `user_id` is provided and valid
    if (user_id) {
      const existingUser = await User.findById(user_id);
      if (existingUser) {
        //existing user by user_id is using the registration API mistakenly
        console.log({
          info: "existing user by user_id is using the registration API mistakenly",
        });
        console.log("User already registered with this ID.");
        return res.status(200).json({
          userId: existingUser._id,
          page: "black",
        });
      } else {
        //old user by user_id is using the registration, but the user is no longer on the database due to database cleanup
        console.log({
          info: "old user by user_id is using the registration route, but the user is no longer on the database due to database cleanup",
        });

        console.log("User ID not found, creating new account.");
        const newUser = await createNewUser(ip, referralLink, device);
        return res.status(201).json({
          userId: newUser._id,
          page: "black",
        });
      }
    } else {
      //first registration attempt, no user and no ip in database
      console.log({
        info: "first registration attempt on new device, no user id found",
      });
      console.log(
        "No user found by ID, creating new user for existing IP and new device."
      );
      const newUser = await createNewUser(ip, referralLink, device);
      return res.status(201).json({
        userId: newUser._id,
        page: "black",
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});
//updated
app.post("/register", async (req, res) => {
  console.log("calling register endpoint");

  const { id, user_id, device, appId } = req.body;
  const ip = req.clientIp;
  console.log({ userIPAddress: ip });
  console.log({ userData: req.body });
  const deviceAppId = appId ? appId : defaultAppId;

  let referralLink = id ? `/?${id}` : null;
  // Allow multiple registration with same ip with different devices or browsers and for different ips
  try {
    // Priority 1: Check if `user_id` is provided and valid
    if (user_id) {
      const existingUser = await User.findById(user_id);
      if (existingUser) {
        //existing user by user_id is using the registration API mistakenly
        console.log({
          info: "existing user by user_id is using the registration API mistakenly",
        });
        console.log("User already registered with this ID.");
        return res.status(200).json({
          userId: existingUser._id,
          page: "black",
        });
      } else {
        //old user by user_id is using the registration, but the user is no longer on the database due to database cleanup
        console.log({
          info: "old user by user_id is using the registration route, but the user is no longer on the database due to database cleanup",
        });

        console.log("User ID not found, creating new account.");
        const newUser = await createNewUser(
          ip,
          referralLink,
          device,
          deviceAppId
        );
        return res.status(201).json({
          userId: newUser._id,
          page: "black",
        });
      }
    } else {
      //first registration attempt, no user and no ip in database
      console.log({
        info: "first registration attempt on new device, no user id found",
      });
      console.log(
        "No user found by ID, creating new user for existing IP and new device."
      );
      const newUser = await createNewUser(
        ip,
        referralLink,
        device,
        deviceAppId
      );
      return res.status(201).json({
        userId: newUser._id,
        page: "black",
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

async function createNewUser(ip, referralLink, device, appId) {
  let updatedUser;
  if (device) {
    if (referralLink) {
      const newUser = await User.create({
        ipAddress: ip, // misplaced params
        device: device,
        appId: appId,
      });
      console.log({ "New user created": newUser });

      if (newUser && referralLink) {
        const user = await User.findById(newUser._id);
        if (user) {
          user.affiliateLink = `${referralLink}&user_id=${newUser._id.toString()}`;
          updatedUser = await user.save();
          console.log({ updatedUser });
        }
        return updatedUser;
      } else {
        return newUser;
      }
    } else {
      const newUser = await User.create({
        ipAddress: ip,
        device: device,
        appId: appId,
      });
      console.log({ "New user created": newUser });

      if (newUser) {
        const user = await User.findById(newUser._id);
        if (user) {
          user.affiliateLink = `?user_id=${newUser._id.toString()}`;
          updatedUser = await user.save();
          console.log({ updatedUser });
        }
        return updatedUser;
      } else {
        return newUser;
      }
    }
  }
}

app.post("/user-info2", async (req, res) => {
  console.log("fetching user info");

  const ip = req.clientIp;
  const { user_id, device, appId } = req.body;
  const deviceAppId = appId ? appId : defaultAppId;

  console.log({ userIPAddress: ip });
  console.log({ userData: req.body });
  try {
    // Priority 1: Check with user_id
    if (user_id) {
      const userExistsByID = await User.findById(user_id);
      if (userExistsByID) {
        console.log({
          info: "old user found by user_id and opening the app through the user-info route ",
        });

        if (userExistsByID.appInstalled == false) {
          const updatedUser = await updateUserPWAInstall(
            userExistsByID._id,
            true
          );
          console.log({ updatedUser });
        }
        if (!userExistsByID.ipAddress) {
          userExistsByID.ipAddress = ip;
          const updatedUser = await userExistsByID.save();

          if (updatedUser) {
            console.log({ message: "user ip updated" });
          }
        }
        console.log("Existing user by ID");
        return res.status(200).json({ user: userExistsByID });
      } else {
        console.log({
          info: "old user by user_id is using the user-info route by opening the app, but the user is no longer on the database due to database cleanup",
        });
        console.log("User not found by User ID, creating new account.");
        const newUser = await createNewUser(ip, null, device);
        return res.status(201).json({ user: newUser });
      }
    }

    if (ip) {
      const users = await User.find({ ipAddress: ip }).sort({ updatedAt: -1 }); //1 for ascending and -1 for descending (descending means having the most recently updated at the top)
      if (users) {
        console.log({
          info: "new user found by ip and opening the app for the first time in the PWA through the user-info route ",
        });
        // consider updating the attribute "appInstalled" to true at this stage
        const userByIp = users[0];
        if (userByIp.appInstalled == false) {
          const updatedUser = await updateUserPWAInstall(userByIp._id, true);
          console.log({ updatedUser });
        }

        return res.status(200).json({ user: userByIp });
      } else {
        console.log({
          info: "old user not found by user_id and ip due to database cleanup",
        });
        console.log("User not found by IP Address, creating new account.");
        const newUser = await createNewUser(ip, null, device, deviceAppId);
        return res.status(201).json({ user: newUser });
      }
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

app.post("/user-info", async (req, res) => {
  console.log("fetching user info");

  const ip = req.clientIp;
  const { user_id, device, appId } = req.body;
  const deviceAppId = appId ? appId : defaultAppId;

  console.log({ userIPAddress: ip });
  console.log({ userData: req.body });
  try {
    // Priority 1: Check with user_id
    if (user_id) {
      const userExistsByID = await User.findById(user_id);
      if (userExistsByID) {
        console.log({
          info: "old user found by user_id and opening the app through the user-info route ",
        });

        console.log({ currentCount: userExistsByID.entryCount });

        userExistsByID.entryCount = userExistsByID.entryCount + 1;
        const updatedUserCount = await userExistsByID.save();

        if (updatedUserCount) {
          const newCount = updatedUserCount?.entryCount
            ? updatedUserCount?.entryCount
            : 0;
          console.log({
            message: "updated entry count",
            count: newCount,
          });
        }

        // if (!userExistsByID.appInstalled == true) {
        //   userExistsByID.entryCount = userExistsByID.entryCount + 1;
        //   const updatedUserCount = await userExistsByID.save();

        //   if (updatedUserCount) {
        //     const newCount = updatedUserCount?.entryCount
        //       ? updatedUserCount?.entryCount
        //       : 0;
        //     console.log({
        //       message: "updated entry count",
        //       count: newCount,
        //     });
        //   }
        // }

        if (userExistsByID.appInstalled == false) {
          const updatedUser = await updateUserPWAInstall(
            userExistsByID._id,
            true
          );
          console.log({ updatedUser });
        }
        if (!userExistsByID.ipAddress) {
          userExistsByID.ipAddress = ip;
          const updatedUser = await userExistsByID.save();

          if (updatedUser) {
            console.log({ message: "user ip updated" });
          }
        }
        console.log("Existing user by ID");
        return res.status(200).json({ user: userExistsByID });
      } else {
        console.log({
          info: "old user by user_id is using the user-info route by opening the app, but the user is no longer on the database due to database cleanup",
        });
        console.log("User not found by User ID, creating new account.");
        const newUser = await createNewUser(ip, null, device);
        return res.status(201).json({ user: newUser });
      }
    }

    if (ip) {
      const users = await User.find({ ipAddress: ip }).sort({ updatedAt: -1 }); //1 for ascending and -1 for descending (descending means having the most recently updated at the top)
      if (users) {
        console.log({
          info: "new user found by ip and opening the app for the first time in the PWA through the user-info route ",
        });
        // consider updating the attribute "appInstalled" to true at this stage
        const userByIp = users[0];
        if (userByIp.appInstalled == false) {
          const updatedUser = await updateUserPWAInstall(userByIp._id, true);
          console.log({ updatedUser });
        }

        return res.status(200).json({ user: userByIp });
      } else {
        console.log({
          info: "old user not found by user_id and ip due to database cleanup",
        });
        console.log("User not found by IP Address, creating new account.");
        const newUser = await createNewUser(ip, null, device, deviceAppId);
        return res.status(201).json({ user: newUser });
      }
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

async function updateUsers() {
  const users = await User.find();

  if (users) {
    console.log(users);
    users.map(async (user) => {
      if (user.affiliateLink == "/?sub_id_1=organic") {
        console.log({ user });
        await updateUserInfo(user._id);
      }
    });

    // await users.save();
  }
}

// updateUsers()

async function updateUserInfo(id) {
  const user = await User.findById(id);
  if (user) {
    user.affiliateLink = "/?sub_id_1=NPR";
    const updatedUser = await user.save();
    console.log({ updatedUser });
  }
}

async function findDuplicatedUsersByIpAddress() {
  // let ip = "35.230.46.208";
  let ip = "::1";
  // let ip = "178.66.145.99";
  //
  // const users = await User.find({ ipAddress: ip });
  const users = await User.find({ ipAddress: ip }).sort({ updatedAt: -1 }); //1 for ascending and -1 for descending (descending means having the most recently updated at the top)
  console.log({ users });
}

async function findAndUpdateUserInstall() {
  // let ip = "35.230.46.208";
  let ip = "::1";
  // let ip = "178.66.145.99";
  //
  // const users = await User.find({ ipAddress: ip });
  const users = await User.find({ ipAddress: ip }).sort({ updatedAt: -1 }); //1 for ascending and -1 for descending (descending means having the most recently updated at the top)
  console.log({ users });

  let user = users[0];

  const updatedUser = await updateUserPWAInstall(user._id, true);

  console.log({ updatedUser });
}
// findAndUpdateUserInstall()
const updateUserPWAInstall = async (userId, appInstalled) => {
  let updatedUser;

  try {
    const user = await User.findById(userId);
    if (user) {
      user.appInstalled = appInstalled;
      updatedUser = await user.save();

      if (updatedUser) {
        console.log({ message: "user app install updated" });
        return updatedUser;
      }
    }
  } catch (error) {
    console.log({ message: error.message });
  }
};

const deleteUser = async (user) => {
  const userId = user._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      console.log({ message: "User not found" });
      // return res.status(404).json({ message: "User not found" })
    }
    console.log({ message: "User not found" });
    // res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log({ message: error.message });
    // res.status(400).json({ message: error.message });
  }
};

//Test notifications

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto: peter.space.io@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Route to handle the push notification request
app.post("/send-notification", (req, res) => {
  const { subscription, data } = req.body;

  // console.log({ subscription });
  // console.log({ data });

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
});

async function generateVapidkeys() {
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log("VAPID Public Key:", vapidKeys.publicKey);
  console.log("VAPID Private Key:", vapidKeys.privateKey);
}
// generateVapidkeys()
//or
//npx web-push generate-vapid-keys --json
//example response: {"publicKey":"BPPmkUKLke6uC19VTi0bJhnefHTmdNSu2UFrH-uzUL_ScihW2l3jHOVJ-oGw7WtHLpz92tz4r5L9Vrow6F0eQ4c","privateKey":"H04IWubw48yQeKJa0uAUSKwJw7amMKMaEZRc4xMxnpo"}
const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
