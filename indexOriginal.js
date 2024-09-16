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
require('./jobs/scheduleNotifications.js');


const PORT = process.env.PORT || 5000;
const keitaro_first_campaign = process.env.KEITARO_FIRST_CAMPAIGN; // for selecting country
const white_page = process.env.WHITE_PAGE_LINK;
const black_page = process.env.BLACK_PAGE_LINK;
const campaignStatus = process.env.CAMPAIGN_STATUS;
const defaultRequestURL = process.env.DEFAULT_REQUEST_URL;
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

app.get("/my-ip", async (req, res) => {
  const ip = req.clientIp;
  console.log("calling host server");
  //======{request objects}====================================
  // const ip = req.clientIp;
  // console.log({ userIPAddress: ip });
  // res.status(200).json(ip);

  if (
    process.env.NODE_ENV === "development" &&
    (ip === "::1" || ip === "127.0.0.1")
  ) {
    console.log({ message: "is local development active" });
    // return next(); // Bypass check in development mode
    const response = {
      userId: "",
      url: black_page,
      page: "black",
    };
    return response;
  } else {
    console.log("empty");
  }
});

// fetchCountryCode()
//======{all request to this endpoint are from the PWA app only}==========================
app.get("/", async (req, res) => {
  console.log("calling host server");
  //======{request objects}====================================
  const ip = req.clientIp;
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { user_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });
  //============{state variables}====================================

  let userExistsByIP = "";
  let userExistsByID = {};
  if (ip) {
    userExistsByIP = await User.findOne({ ipAddress: ip });

    if (!user_id && !userExistsByIP) {
      console.log("organic user");
      await organicUserRegistration(req, res);
    }

    if (!user_id && userExistsByIP) {
      const link1 = keitaro_first_campaign; // first campaign

      let newUrl = link1;
      console.log({ "existing user by IP": userExistsByIP });

      try {
        const userLink = await getFirstLink(req, newUrl, userExistsByIP);

        const response = {
          userId: userExistsByIP._id,
          url: userLink,
        };

        console.log({ response });
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(response);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    }

    if (user_id) {
      userExistsByID = await User.findById({ _id: user_id });

      if (userExistsByID) {
        const link1 = keitaro_first_campaign; // first campaign

        let newUrl = link1;
        console.log({ "existing user by ID": userExistsByID });

        try {
          const userLink = await getFirstLink(req, newUrl, userExistsByID);

          const response = {
            userId: userExistsByID._id,
            url: userLink,
          };

          console.log({ response });
          // res.header("Access-Control-Allow-Origin", "*");
          res.status(200).json(response);
        } catch (error) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(message);
        }
      }
    }
  }

  //==================={New User}========================
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

//====={Keitaro reidrects}===========================================

async function getFirstLink(req, link1, user) {
  // const link1 = keitaro_first_campaign;

  let link = "";
  let link2 = "";
  let finalLink = "";

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
        link2 = link; // without params
        console.log({ link2 });

        console.log({
          stage4: "sending keitaro campaign 2 link with params if available",
        });
        /*
        adding affiliate link to the final endpoint
        For example: 
        Structure: /sub_id_1/sub_id_2
        Subs value: /NPR/123
        */
        if (user && user.affiliateLink) {
          link2 = link + `${user?.affiliateLink}`; // adding affiliate link
        }
      }
    }
    if (link2) {
      try {
        finalLink = await getSecondLink(req, link2);
        return finalLink;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log({ "unsupported country error": message });
        finalLink = white_page;
      }
      // await getSecondLink(req, link2);
    }
    // return link2;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log({ "404 error": message });
    console.log({
      stage6: "return error 404 for unsupported region",
    });
    //New support
    // const url = white_page;
    // return url;
    finalLink = white_page;
  }

  return finalLink;
}

//request: ClientRequest
//path: '/en/registration?bonus=casino&tag=d_2981955m_16303c_pkReg_NPR&pb=667ac95d03f744d094a773846306ece5&click_id=22aur5ff2gs4&r=registration%3fbonus%3dcasino'
//Original URL: https://1xlite-567488.top:443/en/registration?bonus=casino&tag=d_2981955m_16303c_pkReg_NPR&pb=667ac95d03f744d094a773846306ece5&click_id=22aur5ff2hii&r=registration%3fbonus%3dcasino
async function getSecondLink(req, link2) {
  let link3 = "";
  if (link2) {
    // const response = await axios.get(link2);

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.get(link2, {
      headers: req.headers, // Forward original headers if needed
      httpsAgent: agent, // Use the agent that ignores SSL errors
    });

    if (response.data) {
      const originalUrl = response.request.res.responseUrl;
      console.log("Original URL:", originalUrl);
      link3 = originalUrl;
    }
  }

  return link3;
}

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

async function cCountry() {
  const ip = "5.17.17.240";
  const geo = geoip.lookup(ip);
  let isSupportedCountry = false;

  console.log({ geo });

  // if (geo) {
  //   const userCountry = geo.name;

  //   supportedCountries.map((country) => {
  //     if (country === userCountry) {
  //       console.log({ country });
  //       console.log({ message: "Access granted: supported country" });
  //       isSupportedCountry = true;
  //     }
  //   });
  //   if (isSupportedCountry) {
  //     const response = {
  //       userId: "",
  //       link: black_page,
  //       page: "black",
  //     };
  //     return response;
  //   }
  // }

  if (geo) {
    // Check if the user's country is in the supported countries list
    const countryName = supportedCountries.find(
      (country) => geo.name === country
    );

    if (countryName) {
      // User's country is supported, proceed to the next middleware
      console.log({ message: "Access granted: supported country" });

      const response = {
        userId: "",
        link: black_page,
        page: "black",
      };
      console.log({ response });

      return response;
    } else {
      // User's country is not supported
      console.log({ message: "Access denied: Unsupported country" });

      const response = {
        userId: "",
        link: white_page,
        page: "white",
      };

      console.log({ response });
      return response;
    }
  }
}

// cCountry();

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

async function selectCountry2(req, res) {
  // Get the user's IP address from the request
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (campaignStatus === "inactive") {
    const response = {
      userId: "",
      url: white_page,
      page: "white",
    };
    return response;
  }
  // for facebook moderation purpose
  if (campaignStatus === "paused") {
    const response = {
      userId: "",
      url: white_page,
      page: "white",
    };
    return response;
  }
  if (campaignStatus === "active") {
    // Allow localhost without geoip check
    if (
      process.env.NODE_ENV === "development" &&
      (ip === "::1" || ip === "127.0.0.1")
    ) {
      // return next(); // Bypass check in development mode
      const response = {
        userId: "",
        url: black_page,
        page: "black",
      };
      return response;
    }

    // Lookup the country based on the IP address
    const geo = geoip.lookup(ip);

    if (geo) {
      const userCountry = geo.country;

      // Check if the user's country is in the supported countries list
      const countryName = supportedCountries.find(
        (country) => geoip.getCountryName(userCountry) === country
      );

      if (countryName) {
        // User's country is supported, proceed to the next middleware
        console.log({ message: "Access granted: supported country" });

        const response = {
          userId: "",
          url: black_page,
          page: "black",
        };
        return response;
      } else {
        // User's country is not supported
        console.log({ message: "Access denied: Unsupported country" });

        const response = {
          userId: "",
          url: white_page,
          page: "white",
        };

        console.log({ response });
        return response;
      }
    } else {
      // If geo lookup fails, deny access
      console.log({
        message: "Access denied: Country could not be determined",
      });
      const response = {
        userId: "",
        url: white_page,
        page: "white",
      };

      console.log({ response });
      return response;
    }
  }
}
// Middleware to check if the user's country is supported
async function selectCountry1(req, res) {
  // Get the user's IP address from the request
  const ip = req.clientIp;
  if (campaignStatus === "inactive") {
    console.log({ message: "campaignStatus in active" });
    const response = {
      userId: "",
      link: white_page,
      page: "white",
    };
    return response;
  }
  // for facebook moderation purpose
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
      // Check if the user's country is in the supported countries list
      const countryName = supportedCountries.find(
        (country) => geo.name === country
      );

      if (countryName) {
        // User's country is supported, proceed to the next middleware
        console.log({ message: "Access granted: supported country" });

        const response = {
          userId: "",
          link: black_page,
          page: "black",
        };
        console.log({ response });

        return response;
      } else {
        // User's country is not supported
        console.log({ message: "Access denied: Unsupported country" });

        const response = {
          userId: "",
          link: white_page,
          page: "white",
        };

        console.log({ response });
        return response;
      }
    } else {
      // Allow localhost without geoip check
      if (
        process.env.NODE_ENV === "development" &&
        (ip === "::1" || ip === "127.0.0.1")
      ) {
        console.log({ message: "is local development active" });
        // return next(); // Bypass check in development mode
        const response = {
          userId: "",
          link: black_page,
          page: "black",
        };
        return response;
      } else {
        // If geo lookup fails, deny access
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
      }
    }
  }
}

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
          link: white_page,
          page: "white",
        };
        return response;
      }

      if (countryName) {
        console.log({ message: "Access granted: supported country" });

        const response = {
          userId: "",
          link: black_page,
          page: "black",
        };
        console.log({ response });

        return response;
      } else {
        console.log({ message: "Access denied: Unsupported country" });

        const response = {
          userId: "",
          link: white_page,
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
          link: black_page,
          page: "black",
        };
        return response;
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
      }
    }
  }
}

app.get("/register", async (req, res) => {
  console.log("calling host server");
  //======{request objects}====================================

  const ip = req.clientIp;
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, sub_id_2 } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  const userLink = await selectCountry(req, res);

  console.log({ userLinkSent: userLink });

  // no need to register users from unsupported countries
  if (userLink?.page == "white") {
    const response = {
      userId: "",
      url: userLink.link,
      page: userLink.page,
    };

    console.log({ response });
    res.status(200).json(response);
  } else {
    const userExistsByIP = await User.findOne({ ipAddress: ip });

    const path = requestURL; //"/register/?sub_id_1=NPR&sub_id_2=NPR";
    const newPath = path.replace("/register", "");
    console.log({ newPath }); // Output: "/?sub_id_1=NPR&sub_id_2=NPR"

    /*
        extracting affiliate link from the request URL and saving in the database for subsequent calls
        For example: 
        Structure: /sub_id_1/sub_id_2
        Subs value: /NPR/123
        */

    if (!userExistsByIP) {
      console.log("new user");
      const newUser = await User.create({
        ipAddress: ip,
        // userLink: updatedLink,
        affiliateLink: newPath ? newPath : defaultRequestURL, // if there is no request url, then the user is an organic user
      });

      if (newUser) {
        const link1 = keitaro_first_campaign; // first campaign

        let newUrl = link1;
        console.log({ "New user created": newUser });

        if (sub_id_1 || sub_id_2) {
          newUrl = link1 + newPath;
        }

        try {
          const response = {
            userId: newUser._id,
            url: userLink.link,
            page: userLink.page,
          };

          console.log({ response });
          res.status(200).json(response);
        } catch (error) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(message);
        }
      }
    }

    if (userExistsByIP) {
      //link1:  first campaign to check for supported countries
      const link1 = keitaro_first_campaign;

      let newUrl = link1;
      console.log({ "existing user": userExistsByIP });

      if (sub_id_1 || sub_id_2) {
        newUrl = link1 + newPath;
      }

      try {
        const response = {
          userId: userExistsByIP._id,
          url: userLink.link,
          page: userLink.page,
        };

        console.log({ response });
        res.status(200).json(response);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log({ "registration error": message });
      }
    }
  }

  //==================={New User}========================
});

async function organicUserRegistration(req, res) {
  console.log("calling host server");
  //======{request objects}====================================
  const ip = req.clientIp;
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, sub_id_2 } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  const userLink = await selectCountry(req, res);

  // no need to register users from unsupported countries
  if (userLink?.page == "white") {
    const response = {
      userId: "",
      url: userLink.link,
      page: userLink.page,
    };

    console.log({ response });
    res.status(200).json(response);
  } else {
    const userExistsByIP = await User.findOne({ ipAddress: ip });

    const path = requestURL; //"/register/?sub_id_1=NPR&sub_id_2=NPR";
    const newPath = path.replace("/register", "");
    // console.log({ newPath }); // Output: "/?sub_id_1=NPR&sub_id_2=NPR"

    if (!userExistsByIP) {
      console.log("new user");
      const newUser = await User.create({
        ipAddress: ip,
        // affiliateLink: `/?sub_id_1=organic`, // if there is no request url, then the user is an organic user
        affiliateLink: defaultRequestURL, // if there is no request url, then the user is an organic user
      });

      if (newUser) {
        const link1 = keitaro_first_campaign; // first campaign

        let newUrl = link1;
        console.log({ "New user created": newUser });

        if (sub_id_1 || sub_id_2) {
          newUrl = link1 + newPath;
        }

        try {
          const response = {
            user: newUser,
            userId: newUser._id,
            url: userLink.link,
            page: userLink.page,
          };

          console.log({ response });
          res.status(200).json(response);
        } catch (error) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(message);
        }
      }
    }

    if (userExistsByIP) {
      const link1 = keitaro_first_campaign; // first campaign

      let newUrl = link1;
      console.log({ "existing user": userExistsByIP });

      if (sub_id_1 || sub_id_2) {
        newUrl = link1 + newPath;
      }

      try {
        const response = {
          userId: userExistsByIP._id,
          url: userLink.link,
          page: userLink.page,
        };

        console.log({ response });
        res.status(200).json(response);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    }
  }
}


const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

app.get("/user-info", async (req, res) => {
  console.log("fetching user info");
  //======{request objects}====================================
  const ip = req.clientIp;
  const { user_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ Query: req.query });

  if (ip) {
    const userExistsByIP = await User.findOne({ ipAddress: ip });

    if (!user_id && !userExistsByIP) {
      console.log("organic user");
      await organicUserRegistration(req, res);
    }
    if (!user_id && userExistsByIP) {
      console.log("existing user by IP Address");
      const response = {
        user: userExistsByIP,
      };
      res.status(200).json(response);
    }
    if (user_id) {
      const userExistsByID = await User.findById({ _id: user_id });
      if (userExistsByID) {
        console.log("existing user by ID");
        const response = {
          user: userExistsByID,
        };
        res.status(200).json(response);
      }
    }
  }

  //==================={New User}========================
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
  let ip = "35.230.46.208";
  const users = await User.find({ ipAddress: ip });
  console.log({ users });
}
// findDuplicatedUsersByIpAddress()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
