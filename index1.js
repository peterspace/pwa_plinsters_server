const dotenv = require("dotenv").config();
const https = require("https"); // new
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const { getCountryCode } = require("./countryCodes.js");

const User = require("./models/User.js");
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));
// app.use(cors());

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "https://plinsters.netlify.app",
      "https://plinsters.netlify.app/",
      "https://wingo-pwa.onrender.com",
      "exp://192.168.1.49:8081",
      "192.168.1.49:8081",
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      "*",
    ],
    credentials: false,
    // credentials: true,
  })
);
//references
//puppeteer and onrender config with docker: https://www.youtube.com/watch?v=6cm6G78ZDmM&t=320s
// Error Middleware
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
const PORT = process.env.PORT || 5000;
const backend = process.env.BACKEND_URL;
const pixelId = process.env.FACEBOOK_PIXEL_ID;
const pixel_access_token = process.env.FACEBOOK_PIXEL_ACCESS_TOKEN;

//Step1: initial path

function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

//testing purchase call from server

async function sendPurchaseOnServer() {
  const url = `${backend}/create_facebook_purchase_event?fbclid=123&external_id=user125`;

  try {
    const response = await axios.get(url);
    // if (response.data) {
    //   console.log({ response: response.data });
    // }
  } catch (error) {
    console.log({ error });
  }
}

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
// sendPurchaseOnServer();

//http://localhost:4000/create_facebook_purchase_event?fbclid=123&value=25

//http://localhost:4000/create_facebook_purchase_event?fbclid=123&external_id=user125
//http://localhost:4000/create_facebook_lead_event?fbclid=123&external_id=user125

// Endpoint to create Facebook purchase event

//testing lead directly
async function sendLeadOnServer() {
  const url = `${backend}/create_facebook_lead_event?fbclid=123&external_id=user125`;

  try {
    const response = await axios.get(url);
    // if (response.data) {
    //   console.log({ response: response.data });
    // }
  } catch (error) {
    console.log({ error });
  }
}

// sendLeadOnServer();

// Endpoint to create Facebook lead event

// Endpoint to create Facebook lead event
app.get("/facebook_event_notification", async (req, res) => {
  const { event } = req.query;

  if (event) {
    console.log({ fB_event: event });
  }
});

//==============================={Main calls}================================================

// app.get("/", async (req, res) => {
//   console.log("calling host server");
//   //======{request objects}====================================
//   const ip = req.clientIp;
//   const requestURL = req.originalUrl; // This will include query parameters, if any
//   const { user_id } = req.query;

//   console.log({ userIPAddress: ip });
//   console.log({ requestURL });
//   console.log({ Query: req.query });
//   //============{state variables}====================================

//   if (user_id === "1") {
//     // new user
//     console.log("new user");
//     return res.redirect(`${backend}/register`);
//   }
//   const userExistsByIP = await User.findOne({ ipAddress: ip });
//   const userExistsByID = await User.findById({ _id: user_id });

//   //==================={New User}========================

//   /**
//    * register user
//    * redirect user to app store to install app
//    *
//    */

//   if (!user_id && !userExistsByIP) {
//     // new user
//     console.log("new user");
//     return res.redirect(`${backend}/register`);
//   } else if (!user_id && userExistsByIP) {
//     const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

//     let newUrl = link1;
//     console.log({ "existing user by IP": userExistsByIP });

//     // if (sub_id_1 || sub_id_2) {
//     //   newUrl = link1 + newPath;
//     // }

//     try {
//       const userLink = await getFirstLink(req, newUrl, userExistsByIP);

//       const response = {
//         userId: userExistsByIP._id,
//         url: userLink,
//       };

//       console.log({ response });
//       res.status(200).json(response);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//     }
//   } else {
//     const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

//     let newUrl = link1;
//     console.log({ "existing user by ID": userExistsByID });

//     // if (sub_id_1 || sub_id_2) {
//     //   newUrl = link1 + newPath;
//     // }

//     try {
//       const userLink = await getFirstLink(req, newUrl, userExistsByID);

//       const response = {
//         userId: userExistsByID._id,
//         url: userLink,
//       };

//       console.log({ response });
//       res.status(200).json(response);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//     }
//   }
// });

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
      const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

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
        const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

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

// app.get("/", async (req, res) => {
//   console.log("calling host server");
//   //======{request objects}====================================
//   const ip = req.clientIp;
//   const requestURL = req.originalUrl; // This will include query parameters, if any
//   const { user_id } = req.query;

//   console.log({ userIPAddress: ip });
//   console.log({ requestURL });
//   console.log({ Query: req.query });

//   if (!user_id) {
//     console.log("organic user");

//     await organicUserRegistration(req, res);
//   }

//   if (user_id == 1 || user_id == "1") {
//     console.log("organic user");
//     await organicUserRegistration(req, res);
//   }

//   //============{state variables}====================================

//   const userExistsByIP = await User.findOne({ ipAddress: ip });
//   const userExistsByID = await User.findById({ _id: user_id });

//   //==================={New User}========================

//   /**
//    * register user
//    * redirect user to app store to install app
//    *
//    */

//   if (!userExistsByID && !userExistsByIP) {
//     console.log("organic user");
//     await organicUserRegistration(req, res);
//   }

//   if (userExistsByID && userExistsByIP) {
//     //use byID
//     const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

//     let newUrl = link1;
//     console.log({ "existing user by ID": userExistsByID });

//     // if (sub_id_1 || sub_id_2) {
//     //   newUrl = link1 + newPath;
//     // }

//     try {
//       const userLink = await getFirstLink(req, newUrl, userExistsByID);

//       const response = {
//         userId: userExistsByID._id,
//         url: userLink,
//       };

//       console.log({ response });
//       res.status(200).json(response);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//     }
//   }
//   if (!userExistsByID && userExistsByIP) {
//     const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

//     let newUrl = link1;
//     console.log({ "existing user by IP": userExistsByIP });

//     // if (sub_id_1 || sub_id_2) {
//     //   newUrl = link1 + newPath;
//     // }

//     try {
//       const userLink = await getFirstLink(req, newUrl, userExistsByIP);

//       const response = {
//         userId: userExistsByIP._id,
//         url: userLink,
//       };

//       console.log({ response });
//       res.status(200).json(response);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//     }
//   }

//   if (userExistsByID && !userExistsByIP) {
//     //use byID
//     const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

//     let newUrl = link1;
//     console.log({ "existing user by ID": userExistsByID });

//     // if (sub_id_1 || sub_id_2) {
//     //   newUrl = link1 + newPath;
//     // }

//     try {
//       const userLink = await getFirstLink(req, newUrl, userExistsByID);

//       const response = {
//         userId: userExistsByID._id,
//         url: userLink,
//       };

//       console.log({ response });
//       res.status(200).json(response);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//     }
//   }
// });

//======================={conversion api events}============================================
//conversions api calls
//rename as:conversion_purchase_event
app.get("/create_facebook_purchase_event", async (req, res) => {
  const {
    // fbclid,
    sub_id_10,
    external_id,
    date,
    client_ip_address,
    phone,
    email,
    country,
    event_id,
  } = req.query;

  const ip = req.clientIp;

  console.log({ userIPAddress: ip });
  console.log({ requestURL: req.originalUrl });
  console.log({ Query: req.query });

  const unixTimeNow = Math.floor(Date.now() / 1000);
  console.log({ unixTimeNow });

  const min = 1;
  const max = 9999;
  let randomNumberFloat = Math.random() * (max - min) + min;

  const random = Math.round(randomNumberFloat);
  console.log({ random });

  if (unixTimeNow && random) {
    console.log({ processing: "calling facebook endpoint" });

    const pixelId = process.env.FACEBOOK_PIXEL_ID; // Replace with your Pixel ID
    const accessToken = process.env.FACEBOOK_PIXEL_ACCESS_TOKEN; // Replace with your Access Token

    const url = `https://graph.facebook.com/v11.0/${pixelId}/events?access_token=${accessToken}`;

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: date
            ? Math.floor(new Date(date).getTime() / 1000)
            : unixTimeNow,
          action_source: "website",
          event_source_url: "https://av-gameprivacypolicy.site/app",
          event_id: event_id || `event_${unixTimeNow}_${random}`, // add this to pixel data on landing page
          user_data: {
            external_id: external_id ? external_id.toString() : "user123",
            client_ip_address: client_ip_address || ip,
            client_user_agent:
              req.headers["user-agent"] ||
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            fbc: `fb.1.${date || unixTimeNow}.${
              sub_id_10 ? sub_id_10 : "abcdefg"
            }`,
            fbp: `fb.1.${date || unixTimeNow}.${random}`,
            em: email ? [hashData(email.toString())] : null, // Hash and place email in array
            ph: phone ? [hashData(phone.toString())] : null, // Hash and place phone in array
            country: country ? [hashData(country.toString())] : null, // Hash and place country in array//[hashData("us")]
          },
          custom_data: {
            currency: "USD",
            value: 10.0,
          },
        },
      ],
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;
        console.log({ FB_purchase_event_result: result });
      }
    } catch (error) {
      console.log({ FB_purchase_event_error: error });
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  }
});

const FB_purchase_event_result = {
  events_received: 1,
  messages: [],
  fbtrace_id: "ArWB9ILWNOQSdiy9JUUaeK2",
};
// Endpoint to create Facebook lead event
//rename as :pixel_lead_event
app.get("/create_facebook_lead_event", async (req, res) => {
  const {
    // fbclid,
    sub_id_10,
    external_id,
    date,
    client_ip_address,
    phone,
    email,
    country,
    event_id,
  } = req.query;

  const ip = req.clientIp;

  console.log({ userIPAddress: ip });
  console.log({ requestURL: req.originalUrl });
  console.log({ Query: req.query });

  const unixTimeNow = Math.floor(Date.now() / 1000);
  console.log({ unixTimeNow });

  const min = 1;
  const max = 9999;
  let randomNumberFloat = Math.random() * (max - min) + min;

  const random = Math.round(randomNumberFloat);
  console.log({ random });

  if (unixTimeNow && random) {
    console.log({ processing: "calling facebook endpoint" });

    const url = `https://graph.facebook.com/v11.0/${pixelId}/events?access_token=${pixel_access_token}`;

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: date
            ? Math.floor(new Date(date).getTime() / 1000)
            : unixTimeNow,
          action_source: "website",
          event_source_url: "https://av-gameprivacypolicy.site/app",
          event_id: event_id || `event_${unixTimeNow}_${random}`, // add this to pixel data on landing page
          user_data: {
            external_id: external_id
              ? [hashData(external_id.toString())]
              : [hashData("12345")],

            client_ip_address: client_ip_address || ip,
            client_user_agent:
              req.headers["user-agent"] ||
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            fbc: `fb.1.${date || unixTimeNow}.${
              sub_id_10 ? sub_id_10 : "abcdefg"
            }`,
            fbp: `fb.1.${date || unixTimeNow}.${random}`,
            em: email ? [hashData(email.toString())] : null, // Hash and place email in array
            ph: phone ? [hashData(phone.toString())] : null, // Hash and place phone in array
            country: country ? [hashData(country.toString())] : null, // Hash and place country in array//[hashData("us")]
          },
        },
      ],
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;
        console.log({ FB_lead_event_result: result });
      }
    } catch (error) {
      console.log({ FB_lead_event_error: error });
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  }
});

const FB_lead_event_result = {
  events_received: 1,
  messages: [],
  fbtrace_id: "A9bTo8fGaSixvUR5hOQ7lF9",
};

const FB_app_install_event_result = {
  events_received: 1,
  messages: [],
  fbtrace_id: "AWcieJkmzGCLAgp-Mjia0yC",
};

//fb example
const payload = {
  data: [
    {
      event_name: "Purchase",
      event_time: 1720980438,
      action_source: "website",
      user_data: {
        em: [
          "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
        ],
        ph: [null],
      },
      custom_data: {
        currency: "USD",
        value: "142.52",
      },
    },
  ],
};

const purchasePayload1 = {
  data: [
    {
      action_source: "website",
      event_name: "Purchase",
      event_time: 1720981164,
      custom_data: { currency: "USD", value: 142.52 },
      user_data: {
        em: [
          "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
        ],
        ph: [],
        fbc: "fb.1.1558723201720.abcde",
        fbp: "fb.1.1558571054390.1098115397",
        external_id: [
          "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        ],
        country: [],
      },
    },
  ],
};

const purchasePayload = {
  data: [
    {
      event_name: "Purchase",
      event_time: 1720981164,
      action_source: "website",
      user_data: {
        em: [
          "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
        ],
        ph: [null],
        fbc: "fb.1.1558723201720.abcde",
        fbp: "fb.1.1558571054390.1098115397",
        external_id: [
          "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        ],
        country: [null],
      },
      custom_data: {
        currency: "USD",
        value: "142.52",
      },
    },
  ],
};

//set marketers link inside app

// office

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
  // const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts";

  let link = "";
  let link2 = "";

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

        if (user && user.affiliateLink) {
          link2 = link + `${user?.affiliateLink}`; // adding affiliate link
        }
      }
    }
    if (link2) {
      try {
        const finalLink = await getSecondLink(req, link2);
        return finalLink;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
      }
      await getSecondLink(req, link2);
    }
    // return link2;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(message);
    console.log({
      stage6: "return error 404 for unsupported region",
    });
  }
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
      // Accessing the HTML data
      // const htmlData = response.data;
      // console.log("HTML Data:", htmlData);
      // link3 = response.data;
      // console.log({ response: response });

      // console.log({ link3 });
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

app.get("/register", async (req, res) => {
  console.log("calling host server");
  //======{request objects}====================================
  const ip = req.clientIp;
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, sub_id_2 } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  const userExistsByIP = await User.findOne({ ipAddress: ip });

  const path = requestURL; //"/register/?sub_id_1=NPR&sub_id_2=NPR";
  const newPath = path.replace("/register", "");
  console.log({ newPath }); // Output: "/?sub_id_1=NPR&sub_id_2=NPR"

  if (!userExistsByIP) {
    console.log("new user");
    const newUser = await User.create({
      ipAddress: ip,
      // userLink: updatedLink,
      affiliateLink: newPath ? newPath : `/?sub_id_1=organic`, // if there is no request url, then the user is an organic user
    });

    if (newUser) {
      const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

      let newUrl = link1;
      console.log({ "New user created": newUser });

      if (sub_id_1 || sub_id_2) {
        newUrl = link1 + newPath;
      }

      try {
        const userLink = await getFirstLink(req, newUrl, newUser);

        const response = {
          userId: newUser._id,
          url: userLink,
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
    const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

    let newUrl = link1;
    console.log({ "existing user": userExistsByIP });

    if (sub_id_1 || sub_id_2) {
      newUrl = link1 + newPath;
    }

    try {
      const userLink = await getFirstLink(req, newUrl, userExistsByIP);

      const response = {
        userId: userExistsByIP._id,
        url: userLink,
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

  const userExistsByIP = await User.findOne({ ipAddress: ip });

  const path = requestURL; //"/register/?sub_id_1=NPR&sub_id_2=NPR";
  const newPath = path.replace("/register", "");
  // console.log({ newPath }); // Output: "/?sub_id_1=NPR&sub_id_2=NPR"

  if (!userExistsByIP) {
    console.log("new user");
    const newUser = await User.create({
      ipAddress: ip,
      // userLink: updatedLink,
      affiliateLink: `/?sub_id_1=organic`, // if there is no request url, then the user is an organic user
    });

    if (newUser) {
      const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

      let newUrl = link1;
      console.log({ "New user created": newUser });

      if (sub_id_1 || sub_id_2) {
        newUrl = link1 + newPath;
      }

      try {
        const userLink = await getFirstLink(req, newUrl, newUser);

        const response = {
          userId: newUser._id,
          url: userLink,
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
    const link1 = "https://wingsofflimitsprivacy.xyz/JMwehgWngsffLmts"; // first campaign

    let newUrl = link1;
    console.log({ "existing user": userExistsByIP });

    if (sub_id_1 || sub_id_2) {
      newUrl = link1 + newPath;
    }

    try {
      const userLink = await getFirstLink(req, newUrl, userExistsByIP);

      const response = {
        userId: userExistsByIP._id,
        url: userLink,
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

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
