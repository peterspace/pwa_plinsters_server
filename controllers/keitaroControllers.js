const axios = require("axios");
const API_KEY = process.env.KEITARO_API_KEY;
const baseURL = process.env.KEITARO_BASE_URL;

//TODO

const getAllCampaigns = async (req, res) => {
  try {
    const response = await axios.get(baseURL, {
      headers: {
        accept: "application/json",
        "Api-Key": API_KEY,
      },
    });

    if (response.data) {
      const campaigns = response.data;
      res.status(200).json(campaigns);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCampaignsInternal = async () => {
  try {
    const response = await axios.get(baseURL, {
      headers: {
        accept: "application/json",
        "Api-Key": API_KEY,
      },
    });

    if (response.data) {
      const campaigns = response.data;
      console.log({ campaigns });
      return campaigns;
    }
  } catch (error) {
    console.log({ error: error.message });
    return error;
  }
};

const getCampaignByIdInternal = async (id) => {
  // const id = 854
  try {
    const response = await axios.get(`${baseURL}/${id}`, {
      headers: {
        accept: "application/json",
        "Api-Key": API_KEY,
      },
    });

    if (response.data) {
      const campaign = response.data;
      console.log({ campaign });
      return campaign;
    }
  } catch (error) {
    console.log({ error: error.message });
    return error;
  }
};

// getCampaignByIdInternal("854")
// getCampaignByIdInternal(854)

const getCampaignFlows = async (id) => {
  // const id = 854
  try {
    const response = await axios.get(`${baseURL}/${id}/streams`, {
      headers: {
        accept: "application/json",
        "Api-Key": API_KEY,
      },
    });

    if (response.data) {
      const flows = response.data;
      console.log({ flows });
      return flows;
    }
  } catch (error) {
    console.log({ error: error.message });
    return error;
  }
};
// getCampaignFlows(854)

const getClicks = async (id) => {
  // const id = 854

  const userData = {
    range: {
      from: "string",
      to: "string",
      timezone: "string",
    },
    limit: 0,
    offset: 0,
    columns: ["string"],
    filters: [
      {
        name: "string",
        operator: "string",
      },
    ],
    sort: [
      {
        name: "string",
        order: "ASC",
      },
    ],
  };

  try {
    const response = await axios.get(`${baseURL}/${id}/streams`, userData, {
      headers: {
        accept: "application/json",
        "Api-Key": API_KEY,
      },
    });

    if (response.data) {
      const flows = response.data;
      console.log({ flows });
      return flows;
    }
  } catch (error) {
    console.log({ error: error.message });
    return error;
  }
};

async function getKeitaroClicks(minutesAgo = 30) {
  const endpoint = "/clicks/log";
  const url = baseURL + endpoint;

  // Calculate time range (UTC)
  const now = new Date();
  const fromDate = new Date(now.getTime() - minutesAgo * 60000); // X minutes ago

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  const body = {
    range: {
      from: fromDate.toISOString().slice(0, 19).replace("T", " "), // Format: "YYYY-MM-DD HH:MM:SS"
      to: now.toISOString().slice(0, 19).replace("T", " "),
      timezone: "UTC",
    },
    limit: 10000,
    columns: ["datetime", "country", "ip", "campaign_id", "user_agent"],
    sort: [{ name: "datetime", order: "DESC" }],
  };

  try {
    const response = await axios.post(url, body, { headers });
    const clicks = response.data;
    const rows = clicks?.rows || [];

    // console.log({ clicks });
    // console.log({ rows });

    return rows; // Return empty array if no data
  } catch (error) {
    console.log(error);
    console.error("Keitaro API Error:", error.response?.data || error.message);
    return [];
  }
}

// getKeitaroClicks(30)
// return the country of the user
async function getUsersLocationByClicksLocal(
  campaignId,
  userAgent,
  minutesAgo = 10
) {
  try {
    const clicks = await getKeitaroClicks(minutesAgo); // Fetch last X minutes of clicks

    // Find the most recent matching click
    const matchingClick = clicks.find(
      (click) =>
        click.campaign_id == campaignId && click.user_agent === userAgent
    );

    const country = matchingClick?.country || null;
    console.log({ country });
    return country; // Return country or null if not found
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const duration = 30;
const campaignId = 854;

const userAgent =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36";

// const userAgentServer = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36"

// getUsersLocationByClicks(campaignId,userAgent,duration)
// get location by click
async function getUsersLocation(req, res) {
  const { campaignId, userAgent } = req.body;

  const minutesAgo = 10;
  try {
    const clicks = await getKeitaroClicks(minutesAgo); // Fetch last X minutes of clicks

    // Find the most recent matching click
    const matchingClick = clicks.find(
      (click) =>
        click.campaign_id == campaignId && click.user_agent === userAgent
    );

    const country = matchingClick?.country || null;
    console.log({ country });

    res.status(200).json(country);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
//update and delete reviews
module.exports = {
  getAllCampaigns,
  getUsersLocation,
};
