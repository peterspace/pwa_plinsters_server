const dotenv = require("dotenv").config();
const https = require("https"); // new
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
var geoip = require("geoip-country");

const { errorHandler } = require("./middleware/errorMiddleware.js");
const { getCountryCode } = require("./countryCodes.js");
const { createPurchaseEvent } = require("./controllers/purchaseControllers.js");
const { createLeadEvent } = require("./controllers/leadControllers.js");
const User = require("./models/User.js");
const leadRoutes = require("./routes/lead.js");
const purchaseRoutes = require("./routes/purchase.js");
const notificationRoutes = require("./routes/notification.js");

const userRoutes = require("./routes/user.js");
const { rateLimit } = require("express-rate-limit");
// cron job for periodic notification
require("./jobs/scheduleNotifications");

const PORT = process.env.PORT || 5000;
const keitaro_first_campaign = process.env.KEITARO_FIRST_CAMPAIGN; // for selecting country
const white_page = process.env.WHITE_PAGE_LINK;
const black_page = process.env.BLACK_PAGE_LINK;
const campaignStatus = process.env.CAMPAIGN_STATUS;
const defaultRequestURL = process.env.DEFAULT_REQUEST_URL;
const backend = process.env.BACKEND_URL;
// List of supported countries
// Convert the comma-separated string from the environment variable to an array
const supportedCountries = process.env.SUPPORTED_COUNTRIES.split(",");
console.log({ campaignStatus });
console.log("checking commits")

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
app.use(cors());

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

//request: ClientRequest
//path: '/en/registration?bonus=casino&tag=d_2981955m_16303c_pkReg_NPR&pb=667ac95d03f744d094a773846306ece5&click_id=22aur5ff2gs4&r=registration%3fbonus%3dcasino'
//Original URL: https://1xlite-567488.top:443/en/registration?bonus=casino&tag=d_2981955m_16303c_pkReg_NPR&pb=667ac95d03f744d094a773846306ece5&click_id=22aur5ff2hii&r=registration%3fbonus%3dcasino

// getSecondLinkTest()

//====={registration examples but should be with frontend url}=====================
// const link1 =
//   "https://www.dmtgames.pro/register/?sub1=NPR&sub2=291735090";
// const link2 =
//   "https://www.dmtgames.pro/register/?sub1=NPR";
// const link3 =
//   "https://www.dmtgames.pro/register/?sub1=NPR&sub2=291735090";

// add advertiser_tracking_id to installed API call in unity app

//const registrationLink= "http://localhost:4000/register/?sub_id_1=NPR&sub_id_2=125"

//ip:5.17.17.240

/***
 * 
 {
  geo: {
    country: 'RU',
    name: 'Russia',
    native: 'Россия',
    phone: [ 7 ],
    continent: 'AS',
    continents: [ 'AS', 'EU' ],
    capital: 'Moscow',
    currency: [ 'RUB' ],
    languages: [ 'ru' ],
    continent_name: 'Asia'
  }
}
 */

// Middleware to check if the user's country is supported and to redirect any call from facebook,  meta, Instagram, googleplay, apple, and itunes to white page
//================================================================================================================================================================================================================================================================================
// Example1: iOS==> Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/290.0.0.77.121;FBBV/146359065;FBDV/iPhone9,4;FBMD/iPhone;FBSN/iOS;FBSV/14.0;FBSS/3;FBCR/;FBID/phone;FBLC/en_GB;FBOP/5]

/**
 * 
Breakdown of important parts:
FBAN/FBIOS: Indicates that this is the Facebook app for iOS.
FBAV/290.0.0.77.121: The Facebook app version.
FBDV/iPhone9,4: Indicates that the device is an iPhone 7 Plus.
FBSN/iOS; FBSV/14.0: Specifies that the device is running iOS version 14.0.

This string contains the keyword "facebook" within the userAgent string, which is what you are checking for in your code.
 */

// Example1: Android==> Mozilla/5.0 (Linux; Android 10; SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/276.0.0.44.127;]
/**
 * 
FB_IAB/FB4A: Indicates that this is the Facebook app on Android.
FBAV/276.0.0.44.127: Indicates the Facebook app version.
In both cases, the string contains "facebook", which you can use for your check in the user-agent string.
 */

/**
 * 
Why These Substrings:
The FBAV, FBAN, and FB_IAB identifiers are specific to Facebook's in-app browser.
Instagram and Meta can also be identified using their corresponding substrings.
For Google Play, "playstore" is a good identifier for detecting requests originating from the Google Play app or store.
Apple/Itunes user agents often contain "itunes" or "apple" to indicate the source from the Apple ecosystem.
 */

//updated
// async function selectCountryLive(req, res) {
async function selectCountry(req, res) {
  // Get the user's IP address from the request
  const ip = req.clientIp;

  if (campaignStatus === "inactive") {
    console.log({ message: "campaignStatus inactive" });
    const response = {
      userId: "",
      link: white_page,
      page: "white",
    };
    return response;
  }

  if (campaignStatus === "paused") {
    console.log({ message: "campaignStatus paused" });
    const response = {
      userId: "",
      link: white_page,
      page: "white",
    };
    return response;
  }

  if (campaignStatus === "active") {
    console.log({ message: "campaignStatus active" });

    // Lookup the country based on the IP address
    const geo = geoip.lookup(ip);

    if (geo) {
      const countryName = supportedCountries.find(
        (country) => geo.name === country
      );

      // Check for Facebook, Meta, Instagram, Google Play, and Apple App Store user agents using specific substrings
      const userAgent = req.headers["user-agent"].toLowerCase();
      const isSpecialUserAgent =
        userAgent.includes("fbav") || // Facebook app version (common on iOS/Android)
        userAgent.includes("fban") || // Facebook app name (iOS specific)
        userAgent.includes("fb_iab"); // Facebook In-App Browser (Android specific)

      if (isSpecialUserAgent) {
        console.log({
          message:
            "Access for Facebook, Meta, Instagram, Google Play, or Apple App Store",
        });
        const response = {
          userId: "",
          page: "white",
        };
        return response;
      }

      if (countryName) {
        console.log({
          message: `Access granted: supported country is ${countryName}`,
        });

        const response = {
          userId: "",
          page: "black",
        };
        console.log({ response });

        return response;
      } else {
        console.log({
          message: `Access denied: Unsupported country is ${countryName}`,
        });

        const response = {
          userId: "",
          page: "white",
        };

        console.log({ response });
        return response;
      }
    } else {
      console.log({
        message: "Access denied: Country could not be determined",
      });
      const response = {
        userId: "",
        link: white_page,
        page: "white",
      };

      console.log({ response });
      return response;
      // if (
      //   process.env.NODE_ENV === "development" &&
      //   (ip === "::1" || ip === "127.0.0.1")
      // ) {
      //   console.log({ message: "Local development active" });
      //   const response = {
      //     userId: "",
      //     page: "black",
      //   };
      //   return response;
      // } else {
      //   console.log({
      //     message: "Access denied: Country could not be determined",
      //   });
      //   const response = {
      //     userId: "",
      //     page: "white",
      //   };

      //   console.log({ response });
      //   return response;
      // }
    }
  }
}
//======{Allow testing in development mode}=====================
async function selectCountryLocal(req, res) {
  // async function selectCountry(req, res) {
  // Get the user's IP address from the request
  const ip = req.clientIp;

  if (campaignStatus === "inactive") {
    console.log({ message: "campaignStatus inactive" });
    const response = {
      userId: "",
      page: "white",
    };
    return response;
  }

  if (campaignStatus === "paused") {
    console.log({ message: "campaignStatus paused" });
    const response = {
      userId: "",
      page: "white",
    };
    return response;
  }

  if (campaignStatus === "active") {
    console.log({ message: "campaignStatus active" });

    // Lookup the country based on the IP address
    const geo = geoip.lookup(ip);

    if (geo) {
      const countryName = supportedCountries.find(
        (country) => geo.name === country
      );

      // Check for Facebook, Meta, Instagram, Google Play, and Apple App Store user agents using specific substrings
      const userAgent = req.headers["user-agent"].toLowerCase();
      const isSpecialUserAgent =
        userAgent.includes("fbav") || // Facebook app version (common on iOS/Android)
        userAgent.includes("fban") || // Facebook app name (iOS specific)
        userAgent.includes("fb_iab") || // Facebook In-App Browser (Android specific)
        userAgent.includes("instagram") || // Instagram app
        userAgent.includes("meta") || // Meta apps or services
        userAgent.includes("playstore") || // Google Play Store specific substring
        userAgent.includes("itunes") || // Apple iTunes or App Store specific substring
        userAgent.includes("apple"); // General Apple browser or app store

      if (isSpecialUserAgent) {
        console.log({
          message:
            "Access for Facebook, Meta, Instagram, Google Play, or Apple App Store",
        });
        const response = {
          userId: "",
          page: "white",
        };
        return response;
      }

      if (countryName) {
        console.log({ message: "Access granted: supported country" });

        const response = {
          userId: "",
          page: "black",
        };
        console.log({ response });

        return response;
      } else {
        console.log({ message: "Access denied: Unsupported country" });

        const response = {
          userId: "",
          page: "white",
        };

        console.log({ response });
        return response;
      }
    } else {
      if (
        process.env.NODE_ENV === "development" &&
        (ip === "::1" || ip === "127.0.0.1")
      ) {
        console.log({ message: "Local development active" });
        const response = {
          userId: "",
          page: "black",
        };
        return response;
      } else {
        console.log({
          message: "Access denied: Country could not be determined",
        });
        const response = {
          userId: "",
          page: "white",
        };

        console.log({ response });
        return response;
      }
    }
  }
}

//======{new}===============================
app.post("/register", async (req, res) => {
  console.log("calling register endpoint");

  const { id, user_id, device } = req.body;
  const ip = req.clientIp;
  console.log({ userIPAddress: ip });
  console.log({ userData: req.body });

  let referralLink = id ? `/?${id}` : defaultRequestURL;
  const userLink = await selectCountry(req, res);

  console.log({ userLinkSent: userLink });

  // No need to register users from unsupported countries
  if (userLink?.page === "white") {
    const response = {
      userId: "",
      url: userLink.link,
      page: userLink.page,
    };
    console.log({ response });
    return res.status(200).json(response);
  }

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
          page: userLink.page,
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
          page: userLink.page,
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
        page: userLink.page,
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

async function createNewUser1(ip, referralLink, device) {
  if (device) {
    const newUser = await User.create({
      ipAddress: ip,
      affiliateLink: referralLink, // If there is no request URL, the user is considered organic.
      device: device,
    });
    console.log({ "New user created": newUser });
    return newUser;
  } else {
    const newUser = await User.create({
      ipAddress: ip,
      affiliateLink: referralLink, // If there is no request URL, the user is considered organic.
    });
    console.log({ "New user created": newUser });
    return newUser;
  }
}

async function createNewUser(ip, referralLink, device) {
  let updatedUser;
  if (device) {
    const newUser = await User.create({
      ipAddress: ip,
      affiliateLink: referralLink, // If there is no request URL, the user is considered organic.
      device: device,
    });
    console.log({ "New user created": newUser });

    if (newUser) {
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
  }
}

app.post("/user-info1", async (req, res) => {
  console.log("fetching user info");

  const ip = req.clientIp;
  const { user_id, device } = req.body;

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
        console.log("Existing user by ID");
        return res.status(200).json({ user: userExistsByID });
      } else {
        console.log({
          info: "old user by user_id is using the user-info route by opening the app, but the user is no longer on the database due to database cleanup",
        });
        console.log("User not found by User ID, creating new account.");
        const newUser = await createNewUser(ip, defaultRequestURL, device);
        return res.status(201).json({ user: newUser });
      }
    } else {
      console.log({
        info: "old user not found by user_id and ip due to database cleanup",
      });
      console.log("User not found by IP Address, creating new account.");
      const newUser = await createNewUser(ip, defaultRequestURL, device);
      return res.status(201).json({ user: newUser });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

app.post("/user-info", async (req, res) => {
  console.log("fetching user info");

  const ip = req.clientIp;
  const { user_id, device } = req.body;

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
        console.log("Existing user by ID");
        return res.status(200).json({ user: userExistsByID });
      } else {
        console.log({
          info: "old user by user_id is using the user-info route by opening the app, but the user is no longer on the database due to database cleanup",
        });
        console.log("User not found by User ID, creating new account.");
        const newUser = await createNewUser(ip, defaultRequestURL, device);
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
        const newUser = await createNewUser(ip, defaultRequestURL, device);
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

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
