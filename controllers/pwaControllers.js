const Pwa = require("../models/Pwa");

const createPwa = async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      console.log("one or more input required");
      return;
    }
    const newPwa = new Pwa({
      adminId,
    });

    const updatedResponse = await newPwa.save();
    if (updatedResponse) {
      res.status(200).json(updatedResponse);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPwa = async (req, res) => {
  try {
    const pwaApps = await Pwa.find();
    res.status(200).json(pwaApps);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// For apps
const getPwaById = async (req, res) => {
  try {
    const { appId } = req.params;
    const pwa = await Pwa.findById(appId);
    if (!pwa) {
      return res.status(404).json({ message: "Pwa event not found" });
    }
    res.status(200).json(pwa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPwaByIdAndLanguage = async (req, res) => {
  // const { appId, language, country } = req.body;
  console.log("fetching Data by id and language");

  console.log({ params: req.params });
  const { appId, language, country } = req.params;

  if (!country || !language || !appId) {
    return res.status(404).json({ message: "missing data" });
  }

  const pwa = await Pwa.findById(appId);
  if (!pwa) {
    return res.status(404).json({ message: "Pwa event not found" });
  }
  const _id = pwa._id || "";
  const domain = pwa.domain || "";
  const subDomain = pwa.subDomain || "";
  const languages = pwa.languages || "";
  const defaultLanguage = pwa.defaultLanguage || "";
  const pixelId = pwa.pixelId || "";
  const accessToken = pwa.accessToken || "";
  const domainApp = pwa.domainApp || "";
  const domainLanding = pwa.domainLanding || "";
  const keitaroDomain = pwa.keitaroDomain || "";
  const keitaroFirstCampaign = pwa.keitaroFirstCampaign || "";
  const keitaroSecondCampaign = pwa.keitaroSecondCampaign || "";
  const oneSignalApiKey = pwa.oneSignalApiKey || "";
  const oneSignalAppId = pwa.oneSignalAppId || "";
  const marketerTag = pwa.marketerTag || "";
  const icon = pwa.icon || "";
  const logo = pwa.logo || "";
  const appTitle = pwa.appTitle || "";
  const appSubTitle = pwa.appSubTitle || "";
  const backgroundPhotoMobile = pwa.backgroundPhotoMobile || "";
  const backgroundPhotoDesktop = pwa.backgroundPhotoDesktop || "";

  let pwaObject = {};
  let response = {};

  console.log({ countryFormated: country.toLowerCase() });

  try {
    switch (country.toLowerCase()) {
      case "egypt":
        pwaObject = pwa.egypt;
        if (language === "Arabic") {
          response = pwaObject.arabic;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;

      case "iraq":
        pwaObject = pwa.iraq;
        if (language === "Arabic") {
          response = pwaObject.arabic;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "saudi arabia":
        pwaObject = pwa.saudiArabia;
        if (language === "Arabic") {
          response = pwaObject.arabic;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "germany":
        pwaObject = pwa.germany;

        if (language === "Dutch") {
          response = pwaObject.dutch;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "netherlands":
        pwaObject = pwa.netherlands;
        if (language === "Dutch") {
          response = pwaObject.dutch;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "hong kong":
        pwaObject = pwa.hongKong;

        if (language === "Chinese") {
          response = pwaObject.chinese;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "china":
        pwaObject = pwa.china;
        if (language === "Chinese") {
          response = pwaObject.chinese;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "indonesia":
        pwaObject = pwa.indonesia;

        if (language === "Indonesian") {
          response = pwaObject.indonesian;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "malaysia":
        pwaObject = pwa.malaysia;
        if (language === "Malay") {
          response = pwaObject.malay;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "singapore":
        pwaObject = pwa.singapore;
        if (language === "Malay") {
          response = pwaObject.malay;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "united kingdom":
        pwaObject = pwa.unitedKingdom;

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "pakistan":
        pwaObject = pwa.pakistan;
        if (language === "Urdu") {
          response = pwaObject.urdu;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "russia":
        pwaObject = pwa.russia;

        if (language === "Russian") {
          response = pwaObject.russian;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "senegal":
        pwaObject = pwa.senegal;
        if (language === "French") {
          response = pwaObject.french;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "south korea":
        pwaObject = pwa.southKorea;
        if (language === "Korean") {
          response = pwaObject.korean;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "turkey":
        pwaObject = pwa.turkey;
        if (language === "Turkish") {
          response = pwaObject.turkish;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      case "lithuania":
        pwaObject = pwa.lithuania;

        if (language === "Lithuanian") {
          response = pwaObject.lithuanian;
        }

        if (language === "English") {
          response = pwaObject.english;
        }

        break;
      default:
        Console.log("not supported");
        break;
    }

    if (response) {
      response = {
        ...response,
        _id,
        domain,
        subDomain,
        languages,
        defaultLanguage,
        pixelId,
        accessToken,
        domainApp,
        domainLanding,
        keitaroDomain,
        keitaroFirstCampaign,
        keitaroSecondCampaign,
        oneSignalApiKey,
        oneSignalAppId,
        marketerTag,
        icon,
        logo,
        appTitle,
        appSubTitle,
        backgroundPhotoMobile,
        backgroundPhotoDesktop,
      };
      res.status(200).json(response);
    } else {
      res.status(404);
      throw new Error("App not found");
    }
  } catch (error) {
    console.log("general error");
    res.status(400).json({ message: error.message });
  }
};

const updatePwa = async (req, res) => {
  console.log("updating PWA");
  const {
    appId,
    adminId,
    language,
    languages,
    defaultLanguage,
    headerReviews,
    hundredPlus,
    aboutThisGame,
    about,
    updatedDate,
    casino,
    reviewObject,
    icon,
    logo,
    appTitle,
    appSubTitle,
    screenShots,
    domain,
    subDomain,
    pixelId,
    accessToken,
    domainApp,
    domainLanding,
    keitaroDomain,
    keitaroFirstCampaign,
    keitaroSecondCampaign,
    country,
    marketerTag,
    backgroundPhotoMobile,
    backgroundPhotoDesktop,
  } = req.body;

  console.log({
    appData: { appId, adminId, language, screenShots },
  });

  let pwaObject = {};
  // if (!appId) {
  //   console.log("appId required");
  //   return res.status(404).json({ message: "appId required" });
  // }
  // if (!adminId) {
  //   console.log("adminId required");
  //   return res.status(404).json({ message: "adminId required" });
  // }
  // if (!language) {
  //   console.log("language required");
  //   return res.status(404).json({ message: "language required" });
  // }

  if (!country || !appId || !adminId) {
    return res.status(404).json({ message: "missing data" });
  }

  const pwa = await Pwa.findOne({ _id: appId, adminId });

  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  try {
    let updatedPWA = {};
    pwa.domain = domain || pwa.domain;
    pwa.subDomain = subDomain || pwa.subDomain;
    pwa.languages = languages || pwa.languages;
    pwa.defaultLanguage = defaultLanguage || pwa.defaultLanguage;
    pwa.pixelId = pixelId || pwa.pixelId;
    pwa.accessToken = accessToken || pwa.accessToken;
    pwa.domainApp = domainApp || pwa.domainApp;
    pwa.domainLanding = domainLanding || pwa.domainLanding;
    pwa.keitaroDomain = keitaroDomain || pwa.keitaroDomain;
    pwa.keitaroFirstCampaign = keitaroFirstCampaign || pwa.keitaroFirstCampaign;
    pwa.keitaroSecondCampaign =
      keitaroSecondCampaign || pwa.keitaroSecondCampaign;
    pwa.marketerTag = marketerTag || pwa.marketerTag;
    pwa.icon = icon || pwa.icon;
    pwa.logo = logo || pwa.logo;
    pwa.appTitle = appTitle || pwa.appTitle;
    pwa.appSubTitle = appSubTitle || pwa.appSubTitle;
    pwa.backgroundPhotoMobile =
      backgroundPhotoMobile || pwa.backgroundPhotoMobile;
    pwa.backgroundPhotoDesktop =
      backgroundPhotoDesktop || pwa.backgroundPhotoDesktop;

    switch (country) {
      case "egypt":
        pwaObject = pwa.egypt;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;

      case "iraq":
        pwaObject = pwa.iraq;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          //=========================================================================

          updatedPWA = await pwa.save();
        }
        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.icon = icon || pwaObject.english.icon;
          pwaObject.english.logo = logo || pwaObject.english.logo;
          pwaObject.english.appTitle = appTitle || pwaObject.english.appTitle;
          pwaObject.english.appSubTitle =
            appSubTitle || pwaObject.english.appSubTitle;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "saudi arabia":
        pwaObject = pwa.saudiArabia;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "germany":
        pwaObject = pwa.germany;
        if (language === "Dutch") {
          pwaObject.dutch.headerReviews =
            headerReviews || pwaObject.dutch.headerReviews;
          pwaObject.dutch.hundredPlus =
            hundredPlus || pwaObject.dutch.hundredPlus;
          pwaObject.dutch.aboutThisGame =
            aboutThisGame || pwaObject.dutch.aboutThisGame;
          pwaObject.dutch.about = about || pwaObject.dutch.about;
          pwaObject.dutch.updatedDate =
            updatedDate || pwaObject.dutch.updatedDate;
          pwaObject.dutch.casino = casino || pwaObject.dutch.casino;
          pwaObject.dutch.reviewObject =
            reviewObject || pwaObject.dutch.reviewObject;
          pwaObject.dutch.screenShots =
            screenShots || pwaObject.dutch.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.icon = icon || pwaObject.english.icon;
          pwaObject.english.logo = logo || pwaObject.english.logo;
          pwaObject.english.appTitle = appTitle || pwaObject.english.appTitle;
          pwaObject.english.appSubTitle =
            appSubTitle || pwaObject.english.appSubTitle;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "netherlands":
        pwaObject = pwa.netherlands;
        if (language === "Dutch") {
          pwaObject.dutch.headerReviews =
            headerReviews || pwaObject.dutch.headerReviews;
          pwaObject.dutch.hundredPlus =
            hundredPlus || pwaObject.dutch.hundredPlus;
          pwaObject.dutch.aboutThisGame =
            aboutThisGame || pwaObject.dutch.aboutThisGame;
          pwaObject.dutch.about = about || pwaObject.dutch.about;
          pwaObject.dutch.updatedDate =
            updatedDate || pwaObject.dutch.updatedDate;
          pwaObject.dutch.casino = casino || pwaObject.dutch.casino;
          pwaObject.dutch.reviewObject =
            reviewObject || pwaObject.dutch.reviewObject;
          pwaObject.dutch.screenShots =
            screenShots || pwaObject.dutch.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "hong kong":
        pwaObject = pwa.hongKong;
        if (language === "Chinese") {
          pwaObject.chinese.headerReviews =
            headerReviews || pwaObject.chinese.headerReviews;
          pwaObject.chinese.hundredPlus =
            hundredPlus || pwaObject.chinese.hundredPlus;
          pwaObject.chinese.aboutThisGame =
            aboutThisGame || pwaObject.chinese.aboutThisGame;
          pwaObject.chinese.about = about || pwaObject.chinese.about;
          pwaObject.chinese.updatedDate =
            updatedDate || pwaObject.chinese.updatedDate;
          pwaObject.chinese.casino = casino || pwaObject.chinese.casino;
          pwaObject.chinese.reviewObject =
            reviewObject || pwaObject.chinese.reviewObject;
          pwaObject.chinese.screenShots =
            screenShots || pwaObject.chinese.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "china":
        pwaObject = pwa.china;
        if (language === "Chinese") {
          pwaObject.chinese.headerReviews =
            headerReviews || pwaObject.chinese.headerReviews;
          pwaObject.chinese.hundredPlus =
            hundredPlus || pwaObject.chinese.hundredPlus;
          pwaObject.chinese.aboutThisGame =
            aboutThisGame || pwaObject.chinese.aboutThisGame;
          pwaObject.chinese.about = about || pwaObject.chinese.about;
          pwaObject.chinese.updatedDate =
            updatedDate || pwaObject.chinese.updatedDate;
          pwaObject.chinese.casino = casino || pwaObject.chinese.casino;
          pwaObject.chinese.reviewObject =
            reviewObject || pwaObject.chinese.reviewObject;
          pwaObject.chinese.screenShots =
            screenShots || pwaObject.chinese.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "indonesia":
        pwaObject = pwa.indonesia;
        if (language === "Indonesian") {
          pwaObject.indonesian.headerReviews =
            headerReviews || pwaObject.indonesian.headerReviews;
          pwaObject.indonesian.hundredPlus =
            hundredPlus || pwaObject.indonesian.hundredPlus;
          pwaObject.indonesian.aboutThisGame =
            aboutThisGame || pwaObject.indonesian.aboutThisGame;
          pwaObject.indonesian.about = about || pwaObject.indonesian.about;
          pwaObject.indonesian.updatedDate =
            updatedDate || pwaObject.indonesian.updatedDate;
          pwaObject.indonesian.casino = casino || pwaObject.indonesian.casino;
          pwaObject.indonesian.reviewObject =
            reviewObject || pwaObject.indonesian.reviewObject;
          pwaObject.indonesian.screenShots =
            screenShots || pwaObject.indonesian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "malaysia":
        pwaObject = pwa.malaysia;
        if (language === "Malay") {
          pwaObject.malay.headerReviews =
            headerReviews || pwaObject.malay.headerReviews;
          pwaObject.malay.hundredPlus =
            hundredPlus || pwaObject.malay.hundredPlus;
          pwaObject.malay.aboutThisGame =
            aboutThisGame || pwaObject.malay.aboutThisGame;
          pwaObject.malay.about = about || pwaObject.malay.about;
          pwaObject.malay.updatedDate =
            updatedDate || pwaObject.malay.updatedDate;
          pwaObject.malay.casino = casino || pwaObject.malay.casino;
          pwaObject.malay.reviewObject =
            reviewObject || pwaObject.malay.reviewObject;
          pwaObject.malay.screenShots =
            screenShots || pwaObject.malay.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "singapore":
        pwaObject = pwa.singapore;
        if (language === "Malay") {
          pwaObject.malay.headerReviews =
            headerReviews || pwaObject.malay.headerReviews;
          pwaObject.malay.hundredPlus =
            hundredPlus || pwaObject.malay.hundredPlus;
          pwaObject.malay.aboutThisGame =
            aboutThisGame || pwaObject.malay.aboutThisGame;
          pwaObject.malay.about = about || pwaObject.malay.about;
          pwaObject.malay.updatedDate =
            updatedDate || pwaObject.malay.updatedDate;
          pwaObject.malay.casino = casino || pwaObject.malay.casino;
          pwaObject.malay.reviewObject =
            reviewObject || pwaObject.malay.reviewObject;
          pwaObject.malay.screenShots =
            screenShots || pwaObject.malay.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "united kingdom":
        pwaObject = pwa.unitedKingdom;

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "pakistan":
        pwaObject = pwa.pakistan;
        if (language === "Urdu") {
          pwaObject.urdu.headerReviews =
            headerReviews || pwaObject.urdu.headerReviews;
          pwaObject.urdu.hundredPlus =
            hundredPlus || pwaObject.urdu.hundredPlus;
          pwaObject.urdu.aboutThisGame =
            aboutThisGame || pwaObject.urdu.aboutThisGame;
          pwaObject.urdu.about = about || pwaObject.urdu.about;
          pwaObject.urdu.updatedDate =
            updatedDate || pwaObject.urdu.updatedDate;
          pwaObject.urdu.casino = casino || pwaObject.urdu.casino;
          pwaObject.urdu.reviewObject =
            reviewObject || pwaObject.urdu.reviewObject;
          pwaObject.urdu.screenShots =
            screenShots || pwaObject.urdu.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "russia":
        pwaObject = pwa.russia;
        if (language === "Russian") {
          pwaObject.russian.headerReviews =
            headerReviews || pwaObject.russian.headerReviews;
          pwaObject.russian.hundredPlus =
            hundredPlus || pwaObject.russian.hundredPlus;
          pwaObject.russian.aboutThisGame =
            aboutThisGame || pwaObject.russian.aboutThisGame;
          pwaObject.russian.about = about || pwaObject.russian.about;
          pwaObject.russian.updatedDate =
            updatedDate || pwaObject.russian.updatedDate;
          pwaObject.russian.casino = casino || pwaObject.russian.casino;
          pwaObject.russian.reviewObject =
            reviewObject || pwaObject.russian.reviewObject;
          pwaObject.russian.screenShots =
            screenShots || pwaObject.russian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "senegal":
        pwaObject = pwa.senegal;
        if (language === "French") {
          pwaObject.french.headerReviews =
            headerReviews || pwaObject.french.headerReviews;
          pwaObject.french.hundredPlus =
            hundredPlus || pwaObject.french.hundredPlus;
          pwaObject.french.aboutThisGame =
            aboutThisGame || pwaObject.french.aboutThisGame;
          pwaObject.french.about = about || pwaObject.french.about;
          pwaObject.french.updatedDate =
            updatedDate || pwaObject.french.updatedDate;
          pwaObject.french.casino = casino || pwaObject.french.casino;
          pwaObject.french.reviewObject =
            reviewObject || pwaObject.french.reviewObject;
          pwaObject.french.screenShots =
            screenShots || pwaObject.french.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "south korea":
        pwaObject = pwa.southKorea;
        if (language === "Korean") {
          pwaObject.korean.headerReviews =
            headerReviews || pwaObject.korean.headerReviews;
          pwaObject.korean.hundredPlus =
            hundredPlus || pwaObject.korean.hundredPlus;
          pwaObject.korean.aboutThisGame =
            aboutThisGame || pwaObject.korean.aboutThisGame;
          pwaObject.korean.about = about || pwaObject.korean.about;
          pwaObject.korean.updatedDate =
            updatedDate || pwaObject.korean.updatedDate;
          pwaObject.korean.casino = casino || pwaObject.korean.casino;
          pwaObject.korean.reviewObject =
            reviewObject || pwaObject.korean.reviewObject;
          pwaObject.korean.screenShots =
            screenShots || pwaObject.korean.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "turkey":
        pwaObject = pwa.turkey;
        if (language === "Turkish") {
          pwaObject.turkish.headerReviews =
            headerReviews || pwaObject.turkish.headerReviews;
          pwaObject.turkish.hundredPlus =
            hundredPlus || pwaObject.turkish.hundredPlus;
          pwaObject.turkish.aboutThisGame =
            aboutThisGame || pwaObject.turkish.aboutThisGame;
          pwaObject.turkish.about = about || pwaObject.turkish.about;
          pwaObject.turkish.updatedDate =
            updatedDate || pwaObject.turkish.updatedDate;
          pwaObject.turkish.casino = casino || pwaObject.turkish.casino;
          pwaObject.turkish.reviewObject =
            reviewObject || pwaObject.turkish.reviewObject;
          pwaObject.turkish.screenShots =
            screenShots || pwaObject.turkish.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "lithuania":
        pwaObject = pwa.lithuania;
        if (language === "Lithuanian") {
          pwaObject.lithuanian.headerReviews =
            headerReviews || pwaObject.lithuanian.headerReviews;
          pwaObject.lithuanian.hundredPlus =
            hundredPlus || pwaObject.lithuanian.hundredPlus;
          pwaObject.lithuanian.aboutThisGame =
            aboutThisGame || pwaObject.lithuanian.aboutThisGame;
          pwaObject.lithuanian.about = about || pwaObject.lithuanian.about;
          pwaObject.lithuanian.updatedDate =
            updatedDate || pwaObject.lithuanian.updatedDate;
          pwaObject.lithuanian.casino = casino || pwaObject.lithuanian.casino;
          pwaObject.lithuanian.reviewObject =
            reviewObject || pwaObject.lithuanian.reviewObject;
          pwaObject.lithuanian.screenShots =
            screenShots || pwaObject.lithuanian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      default:
        Console.log("not supported");
        break;
    }

    if (updatedPWA) {
      res.status(200).json(updatedPWA);
    } else {
      res.status(404);
      throw new Error("App not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePwaGeneral = async (req, res) => {
  console.log("updating PWA General");
  const {
    appId,
    adminId,
    languages, // not needed
    defaultLanguage, // not needed
    icon,
    logo,
    appTitle,
    appSubTitle,
    domain,
    subDomain,
    pixelId,
    accessToken,
    domainApp,
    domainLanding,
    keitaroDomain,
    keitaroFirstCampaign,
    keitaroSecondCampaign,
    marketerTag,
    backgroundPhotoMobile,
    backgroundPhotoDesktop,
    oneSignalApiKey,
    oneSignalAppId,
  } = req.body;

  if (!appId || !adminId) {
    return res.status(404).json({ message: "missing data" });
  }

  const pwa = await Pwa.findOne({ _id: appId, adminId });

  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  try {
    let updatedPWA = {};
    pwa.domain = domain || pwa.domain;
    pwa.subDomain = subDomain || pwa.subDomain;
    pwa.languages = languages || pwa.languages;
    pwa.defaultLanguage = defaultLanguage || pwa.defaultLanguage;
    pwa.pixelId = pixelId || pwa.pixelId;
    pwa.accessToken = accessToken || pwa.accessToken;
    pwa.domainApp = domainApp || pwa.domainApp;
    pwa.domainLanding = domainLanding || pwa.domainLanding;
    pwa.keitaroDomain = keitaroDomain || pwa.keitaroDomain;
    pwa.keitaroFirstCampaign = keitaroFirstCampaign || pwa.keitaroFirstCampaign;
    pwa.keitaroSecondCampaign =
      keitaroSecondCampaign || pwa.keitaroSecondCampaign;
    pwa.marketerTag = marketerTag || pwa.marketerTag;
    pwa.icon = icon || pwa.icon;
    pwa.logo = logo || pwa.logo;
    pwa.appTitle = appTitle || pwa.appTitle;
    pwa.appSubTitle = appSubTitle || pwa.appSubTitle;
    pwa.backgroundPhotoMobile =
      backgroundPhotoMobile || pwa.backgroundPhotoMobile;
    pwa.backgroundPhotoDesktop =
      backgroundPhotoDesktop || pwa.backgroundPhotoDesktop;
    pwa.oneSignalApiKey = oneSignalApiKey || pwa.oneSignalApiKey;
    pwa.oneSignalAppId = oneSignalAppId || pwa.oneSignalAppId;
    updatedPWA = await pwa.save();

    if (updatedPWA) {
      res.status(200).json(updatedPWA);
    } else {
      res.status(404);
      throw new Error("App not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePwaByCountryAndLanguage = async (req, res) => {
  console.log("updating PWA");
  const {
    appId,
    adminId,
    language,
    headerReviews,
    hundredPlus,
    aboutThisGame,
    about,
    updatedDate,
    reviewObject,
    screenShots,
    country,
    casino,
  } = req.body;

  console.log({
    appData: req.body,
  });

  let pwaObject = {};
  // if (!appId) {
  //   console.log("appId required");
  //   return res.status(404).json({ message: "appId required" });
  // }
  // if (!adminId) {
  //   console.log("adminId required");
  //   return res.status(404).json({ message: "adminId required" });
  // }
  // if (!language) {
  //   console.log("language required");
  //   return res.status(404).json({ message: "language required" });
  // }

  if (!country || !appId || !adminId) {
    return res.status(404).json({ message: "missing data" });
  }

  const pwa = await Pwa.findOne({ _id: appId, adminId });

  if (!pwa) {
    return res.status(404).json({ message: "Pwa not found" });
  }

  try {
    let updatedPWA = {};

    switch (country) {
      case "egypt":
        pwaObject = pwa.egypt;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;

      case "iraq":
        pwaObject = pwa.iraq;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          //=========================================================================

          updatedPWA = await pwa.save();
        }
        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.icon = icon || pwaObject.english.icon;
          pwaObject.english.logo = logo || pwaObject.english.logo;
          pwaObject.english.appTitle = appTitle || pwaObject.english.appTitle;
          pwaObject.english.appSubTitle =
            appSubTitle || pwaObject.english.appSubTitle;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "saudi arabia":
        pwaObject = pwa.saudiArabia;
        if (language === "Arabic") {
          pwaObject.arabic.headerReviews =
            headerReviews || pwaObject.arabic.headerReviews;
          pwaObject.arabic.hundredPlus =
            hundredPlus || pwaObject.arabic.hundredPlus;
          pwaObject.arabic.aboutThisGame =
            aboutThisGame || pwaObject.arabic.aboutThisGame;
          pwaObject.arabic.about = about || pwaObject.arabic.about;
          pwaObject.arabic.updatedDate =
            updatedDate || pwaObject.arabic.updatedDate;
          pwaObject.arabic.casino = casino || pwaObject.arabic.casino;
          pwaObject.arabic.reviewObject =
            reviewObject || pwaObject.arabic.reviewObject;
          pwaObject.arabic.screenShots =
            screenShots || pwaObject.arabic.screenShots;
          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "germany":
        pwaObject = pwa.germany;
        if (language === "Dutch") {
          pwaObject.dutch.headerReviews =
            headerReviews || pwaObject.dutch.headerReviews;
          pwaObject.dutch.hundredPlus =
            hundredPlus || pwaObject.dutch.hundredPlus;
          pwaObject.dutch.aboutThisGame =
            aboutThisGame || pwaObject.dutch.aboutThisGame;
          pwaObject.dutch.about = about || pwaObject.dutch.about;
          pwaObject.dutch.updatedDate =
            updatedDate || pwaObject.dutch.updatedDate;
          pwaObject.dutch.casino = casino || pwaObject.dutch.casino;
          pwaObject.dutch.reviewObject =
            reviewObject || pwaObject.dutch.reviewObject;
          pwaObject.dutch.screenShots =
            screenShots || pwaObject.dutch.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.icon = icon || pwaObject.english.icon;
          pwaObject.english.logo = logo || pwaObject.english.logo;
          pwaObject.english.appTitle = appTitle || pwaObject.english.appTitle;
          pwaObject.english.appSubTitle =
            appSubTitle || pwaObject.english.appSubTitle;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "netherlands":
        pwaObject = pwa.netherlands;
        if (language === "Dutch") {
          pwaObject.dutch.headerReviews =
            headerReviews || pwaObject.dutch.headerReviews;
          pwaObject.dutch.hundredPlus =
            hundredPlus || pwaObject.dutch.hundredPlus;
          pwaObject.dutch.aboutThisGame =
            aboutThisGame || pwaObject.dutch.aboutThisGame;
          pwaObject.dutch.about = about || pwaObject.dutch.about;
          pwaObject.dutch.updatedDate =
            updatedDate || pwaObject.dutch.updatedDate;
          pwaObject.dutch.casino = casino || pwaObject.dutch.casino;
          pwaObject.dutch.reviewObject =
            reviewObject || pwaObject.dutch.reviewObject;
          pwaObject.dutch.screenShots =
            screenShots || pwaObject.dutch.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "hong kong":
        pwaObject = pwa.hongKong;
        if (language === "Chinese") {
          pwaObject.chinese.headerReviews =
            headerReviews || pwaObject.chinese.headerReviews;
          pwaObject.chinese.hundredPlus =
            hundredPlus || pwaObject.chinese.hundredPlus;
          pwaObject.chinese.aboutThisGame =
            aboutThisGame || pwaObject.chinese.aboutThisGame;
          pwaObject.chinese.about = about || pwaObject.chinese.about;
          pwaObject.chinese.updatedDate =
            updatedDate || pwaObject.chinese.updatedDate;
          pwaObject.chinese.casino = casino || pwaObject.chinese.casino;
          pwaObject.chinese.reviewObject =
            reviewObject || pwaObject.chinese.reviewObject;
          pwaObject.chinese.screenShots =
            screenShots || pwaObject.chinese.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "china":
        pwaObject = pwa.china;
        if (language === "Chinese") {
          pwaObject.chinese.headerReviews =
            headerReviews || pwaObject.chinese.headerReviews;
          pwaObject.chinese.hundredPlus =
            hundredPlus || pwaObject.chinese.hundredPlus;
          pwaObject.chinese.aboutThisGame =
            aboutThisGame || pwaObject.chinese.aboutThisGame;
          pwaObject.chinese.about = about || pwaObject.chinese.about;
          pwaObject.chinese.updatedDate =
            updatedDate || pwaObject.chinese.updatedDate;
          pwaObject.chinese.casino = casino || pwaObject.chinese.casino;
          pwaObject.chinese.reviewObject =
            reviewObject || pwaObject.chinese.reviewObject;
          pwaObject.chinese.screenShots =
            screenShots || pwaObject.chinese.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "indonesia":
        pwaObject = pwa.indonesia;
        if (language === "Indonesian") {
          pwaObject.indonesian.headerReviews =
            headerReviews || pwaObject.indonesian.headerReviews;
          pwaObject.indonesian.hundredPlus =
            hundredPlus || pwaObject.indonesian.hundredPlus;
          pwaObject.indonesian.aboutThisGame =
            aboutThisGame || pwaObject.indonesian.aboutThisGame;
          pwaObject.indonesian.about = about || pwaObject.indonesian.about;
          pwaObject.indonesian.updatedDate =
            updatedDate || pwaObject.indonesian.updatedDate;
          pwaObject.indonesian.casino = casino || pwaObject.indonesian.casino;
          pwaObject.indonesian.reviewObject =
            reviewObject || pwaObject.indonesian.reviewObject;
          pwaObject.indonesian.screenShots =
            screenShots || pwaObject.indonesian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "malaysia":
        pwaObject = pwa.malaysia;
        if (language === "Malay") {
          pwaObject.malay.headerReviews =
            headerReviews || pwaObject.malay.headerReviews;
          pwaObject.malay.hundredPlus =
            hundredPlus || pwaObject.malay.hundredPlus;
          pwaObject.malay.aboutThisGame =
            aboutThisGame || pwaObject.malay.aboutThisGame;
          pwaObject.malay.about = about || pwaObject.malay.about;
          pwaObject.malay.updatedDate =
            updatedDate || pwaObject.malay.updatedDate;
          pwaObject.malay.casino = casino || pwaObject.malay.casino;
          pwaObject.malay.reviewObject =
            reviewObject || pwaObject.malay.reviewObject;
          pwaObject.malay.screenShots =
            screenShots || pwaObject.malay.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "singapore":
        pwaObject = pwa.singapore;
        if (language === "Malay") {
          pwaObject.malay.headerReviews =
            headerReviews || pwaObject.malay.headerReviews;
          pwaObject.malay.hundredPlus =
            hundredPlus || pwaObject.malay.hundredPlus;
          pwaObject.malay.aboutThisGame =
            aboutThisGame || pwaObject.malay.aboutThisGame;
          pwaObject.malay.about = about || pwaObject.malay.about;
          pwaObject.malay.updatedDate =
            updatedDate || pwaObject.malay.updatedDate;
          pwaObject.malay.casino = casino || pwaObject.malay.casino;
          pwaObject.malay.reviewObject =
            reviewObject || pwaObject.malay.reviewObject;
          pwaObject.malay.screenShots =
            screenShots || pwaObject.malay.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "united kingdom":
        pwaObject = pwa.unitedKingdom;

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "pakistan":
        pwaObject = pwa.pakistan;
        if (language === "Urdu") {
          pwaObject.urdu.headerReviews =
            headerReviews || pwaObject.urdu.headerReviews;
          pwaObject.urdu.hundredPlus =
            hundredPlus || pwaObject.urdu.hundredPlus;
          pwaObject.urdu.aboutThisGame =
            aboutThisGame || pwaObject.urdu.aboutThisGame;
          pwaObject.urdu.about = about || pwaObject.urdu.about;
          pwaObject.urdu.updatedDate =
            updatedDate || pwaObject.urdu.updatedDate;
          pwaObject.urdu.casino = casino || pwaObject.urdu.casino;
          pwaObject.urdu.reviewObject =
            reviewObject || pwaObject.urdu.reviewObject;
          pwaObject.urdu.screenShots =
            screenShots || pwaObject.urdu.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "russia":
        pwaObject = pwa.russia;
        if (language === "Russian") {
          pwaObject.russian.headerReviews =
            headerReviews || pwaObject.russian.headerReviews;
          pwaObject.russian.hundredPlus =
            hundredPlus || pwaObject.russian.hundredPlus;
          pwaObject.russian.aboutThisGame =
            aboutThisGame || pwaObject.russian.aboutThisGame;
          pwaObject.russian.about = about || pwaObject.russian.about;
          pwaObject.russian.updatedDate =
            updatedDate || pwaObject.russian.updatedDate;
          pwaObject.russian.casino = casino || pwaObject.russian.casino;
          pwaObject.russian.reviewObject =
            reviewObject || pwaObject.russian.reviewObject;
          pwaObject.russian.screenShots =
            screenShots || pwaObject.russian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "senegal":
        pwaObject = pwa.senegal;
        if (language === "French") {
          pwaObject.french.headerReviews =
            headerReviews || pwaObject.french.headerReviews;
          pwaObject.french.hundredPlus =
            hundredPlus || pwaObject.french.hundredPlus;
          pwaObject.french.aboutThisGame =
            aboutThisGame || pwaObject.french.aboutThisGame;
          pwaObject.french.about = about || pwaObject.french.about;
          pwaObject.french.updatedDate =
            updatedDate || pwaObject.french.updatedDate;
          pwaObject.french.casino = casino || pwaObject.french.casino;
          pwaObject.french.reviewObject =
            reviewObject || pwaObject.french.reviewObject;
          pwaObject.french.screenShots =
            screenShots || pwaObject.french.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "south korea":
        pwaObject = pwa.southKorea;
        if (language === "Korean") {
          pwaObject.korean.headerReviews =
            headerReviews || pwaObject.korean.headerReviews;
          pwaObject.korean.hundredPlus =
            hundredPlus || pwaObject.korean.hundredPlus;
          pwaObject.korean.aboutThisGame =
            aboutThisGame || pwaObject.korean.aboutThisGame;
          pwaObject.korean.about = about || pwaObject.korean.about;
          pwaObject.korean.updatedDate =
            updatedDate || pwaObject.korean.updatedDate;
          pwaObject.korean.casino = casino || pwaObject.korean.casino;
          pwaObject.korean.reviewObject =
            reviewObject || pwaObject.korean.reviewObject;
          pwaObject.korean.screenShots =
            screenShots || pwaObject.korean.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "turkey":
        pwaObject = pwa.turkey;
        if (language === "Turkish") {
          pwaObject.turkish.headerReviews =
            headerReviews || pwaObject.turkish.headerReviews;
          pwaObject.turkish.hundredPlus =
            hundredPlus || pwaObject.turkish.hundredPlus;
          pwaObject.turkish.aboutThisGame =
            aboutThisGame || pwaObject.turkish.aboutThisGame;
          pwaObject.turkish.about = about || pwaObject.turkish.about;
          pwaObject.turkish.updatedDate =
            updatedDate || pwaObject.turkish.updatedDate;
          pwaObject.turkish.casino = casino || pwaObject.turkish.casino;
          pwaObject.turkish.reviewObject =
            reviewObject || pwaObject.turkish.reviewObject;
          pwaObject.turkish.screenShots =
            screenShots || pwaObject.turkish.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      case "lithuania":
        pwaObject = pwa.lithuania;
        if (language === "Lithuanian") {
          pwaObject.lithuanian.headerReviews =
            headerReviews || pwaObject.lithuanian.headerReviews;
          pwaObject.lithuanian.hundredPlus =
            hundredPlus || pwaObject.lithuanian.hundredPlus;
          pwaObject.lithuanian.aboutThisGame =
            aboutThisGame || pwaObject.lithuanian.aboutThisGame;
          pwaObject.lithuanian.about = about || pwaObject.lithuanian.about;
          pwaObject.lithuanian.updatedDate =
            updatedDate || pwaObject.lithuanian.updatedDate;
          pwaObject.lithuanian.casino = casino || pwaObject.lithuanian.casino;
          pwaObject.lithuanian.reviewObject =
            reviewObject || pwaObject.lithuanian.reviewObject;
          pwaObject.lithuanian.screenShots =
            screenShots || pwaObject.lithuanian.screenShots;

          //=========================================================================

          updatedPWA = await pwa.save();
        }

        if (language === "English") {
          pwaObject.english.headerReviews =
            headerReviews || pwaObject.english.headerReviews;
          pwaObject.english.hundredPlus =
            hundredPlus || pwaObject.english.hundredPlus;
          pwaObject.english.aboutThisGame =
            aboutThisGame || pwaObject.english.aboutThisGame;
          pwaObject.english.about = about || pwaObject.english.about;
          pwaObject.english.updatedDate =
            updatedDate || pwaObject.english.updatedDate;
          pwaObject.english.casino = casino || pwaObject.english.casino;
          pwaObject.english.reviewObject =
            reviewObject || pwaObject.english.reviewObject;
          pwaObject.english.screenShots =
            screenShots || pwaObject.english.screenShots;
          updatedPWA = await pwa.save();
        }

        break;
      default:
        Console.log("not supported");
        break;
    }

    if (updatedPWA) {
      res.status(200).json(updatedPWA);
    } else {
      res.status(404);
      throw new Error("App not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePwa = async (req, res) => {
  try {
    const { appId } = req.params;
    const deletedApp = await Pwa.findByIdAndDelete(appId);
    if (!deletedApp) {
      return res.status(404).json({ message: "Pwa app not found" });
    }
    res.status(200).json({ message: "Pwa app deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//TODO

//update and delete reviews
module.exports = {
  createPwa,
  getAllPwa,
  getPwaByIdAndLanguage,
  getPwaById,
  updatePwa,
  updatePwaGeneral,
  updatePwaByCountryAndLanguage,
  deletePwa,
};
