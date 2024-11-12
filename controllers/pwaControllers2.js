const Pwa = require("../models/Pwa");

const createPwa = async (req, res) => {
  try {
    const {
      language,
      open,
      stayOn,
      add,
      clickIcon,
      pressIcon,
      step1ChromeDesktop,
      step2ChromeDesktop,
      step1SafariDesktop,
      step2SafariDesktop,
      step3SafariDesktop,
      step1ChromeMobile,
      step2ChromeMobile,
      step3ChromeMobile,
      step1SafariMobile,
      step2SafariMobile,
      step3SafariMobile,
      greeting,
      wait,
      proceed,
      description,
      containsAds,
      inAppPurchases,
      headerReviews,
      hundredPlus,
      downloads,
      ageLimit,
      ageRating,
      install,
      wishlist,
      available,
      aboutThisGame,
      about1,
      about2,
      about3,
      updatedOn,
      updatedDate,
      casino,
      dataSafety,
      safety,
      noInformation,
      seeDetails,
      ratingsAndReviews,
      verified,
      phone,
      tV,
      chromebook,
      tablet,
      reviews,
      fourPointThree,
      fifteenM,
      review1,
      review2,
      review3,
      review4,
      allReviews,
      whatsNew,
      findHelpful,
      yes,
      no,
      contact,
      icon,
      screenShots,
      fallBackScreenShots,
      backgroundPhotoMobile,
      backgroundPhotoDesktop,
      fallBackBackgroundPhotoMobile,
      fallBackBackgroundPhotoDesktop,
      logo,
      appTitle,
      appSubTitle,
    } = req.body;

    const userData = {
      open,
      stayOn,
      add,
      clickIcon,
      pressIcon,
      step1ChromeDesktop,
      step2ChromeDesktop,
      step1SafariDesktop,
      step2SafariDesktop,
      step3SafariDesktop,
      step1ChromeMobile,
      step2ChromeMobile,
      step3ChromeMobile,
      step1SafariMobile,
      step2SafariMobile,
      step3SafariMobile,
      greeting,
      wait,
      proceed,
      description,
      containsAds,
      inAppPurchases,
      headerReviews,
      hundredPlus,
      downloads,
      ageLimit,
      ageRating,
      install,
      wishlist,
      available,
      aboutThisGame,
      about1,
      about2,
      about3,
      updatedOn,
      updatedDate,
      casino,
      dataSafety,
      safety,
      noInformation,
      seeDetails,
      ratingsAndReviews,
      verified,
      phone,
      tV,
      chromebook,
      tablet,
      reviews,
      fourPointThree,
      fifteenM,
      review1,
      review2,
      review3,
      review4,
      allReviews,
      whatsNew,
      findHelpful,
      yes,
      no,
      contact,
      icon,
      screenShots,
      fallBackScreenShots,
      backgroundPhotoMobile,
      backgroundPhotoDesktop,
      fallBackBackgroundPhotoMobile,
      fallBackBackgroundPhotoDesktop,
      logo,
      appTitle,
      appSubTitle,
    };

    let newPwa = {};
    if (language === "Arabic") {
      newPwa = new Pwa({ arabic: userData });
    }

    if (language === "Chinese") {
      newPwa = new Pwa({ chinese: userData });
    }
    if (language === "Dutch") {
      newPwa = new Pwa({ dutch: userData });
    }
    if (language === "English") {
      newPwa = new Pwa({ english: userData });
    }
    if (language === "French") {
      newPwa = new Pwa({ french: userData });
    }
    if (language === "Indonesian") {
      newPwa = new Pwa({ indonesian: userData });
    }
    if (language === "Urdu") {
      newPwa = new Pwa({ urdu: userData });
    }
    if (language === "Korean") {
      newPwa = new Pwa({ korean: userData });
    }
    if (language === "Russian") {
      newPwa = new Pwa({ russian: userData });
    }
    if (language === "Turkish") {
      newPwa = new Pwa({ turkish: userData });
    }
    if (language === "Malay") {
      newPwa = new Pwa({ malay: userData });
    }

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
const getPwaByIdAndLanguage = async (req, res) => {
  try {
    const { appId, language } = req.params;
    const pwa = await Pwa.findById(appId);
    if (!pwa) {
      return res.status(404).json({ message: "Pwa event not found" });
    }

    let response = {};
    if (language === "Arabic") {
      response = pwa.arabic;
    }

    if (language === "Chinese") {
      response = pwa.chinese;
    }
    if (language === "Dutch") {
      response = pwa.dutch;
    }
    if (language === "English") {
      response = pwa.english;
    }
    if (language === "French") {
      response = pwa.french;
    }
    if (language === "Indonesian") {
      response = pwa.indonesian;
    }
    if (language === "Urdu") {
      response = pwa.urdu;
    }
    if (language === "Korean") {
      response = pwa.korean;
    }
    if (language === "Russian") {
      response = pwa.russian;
    }
    if (language === "Turkish") {
      response = pwa.turkish;
    }
    if (language === "Urdu") {
      response = pwa.urdu;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

const updatePwa = async (req, res) => {
  try {
    const {
      appId,
      adminId,
      language,
      open,
      stayOn,
      add,
      clickIcon,
      pressIcon,
      step1ChromeDesktop,
      step2ChromeDesktop,
      step1SafariDesktop,
      step2SafariDesktop,
      step3SafariDesktop,
      step1ChromeMobile,
      step2ChromeMobile,
      step3ChromeMobile,
      step1SafariMobile,
      step2SafariMobile,
      step3SafariMobile,
      greeting,
      wait,
      proceed,
      description,
      containsAds,
      inAppPurchases,
      headerReviews,
      hundredPlus,
      downloads,
      ageLimit,
      ageRating,
      install,
      wishlist,
      available,
      aboutThisGame,
      about1,
      about2,
      about3,
      updatedOn,
      updatedDate,
      casino,
      dataSafety,
      safety,
      noInformation,
      seeDetails,
      ratingsAndReviews,
      verified,
      phone,
      tV,
      chromebook,
      tablet,
      reviews,
      fourPointThree,
      fifteenM,
      review1,
      review2,
      review3,
      review4,
      allReviews,
      whatsNew,
      findHelpful,
      yes,
      no,
      contact,
      icon,
      screenShots,
      fallBackScreenShots,
      backgroundPhotoMobile,
      backgroundPhotoDesktop,
      fallBackBackgroundPhotoMobile,
      fallBackBackgroundPhotoDesktop,
      logo,
      appTitle,
      appSubTitle,
    } = req.body;
    const pwa = await Pwa.findOne({ _id: appId, adminId });
    if (pwa) {
      let updatedPWA = {};
      if (language === "Arabic") {
        pwa.arabic.open = open || pwa.arabic.open;
        pwa.arabic.stayOn = stayOn || pwa.arabic.stayOn;
        pwa.arabic.add = add || pwa.arabic.add;
        pwa.arabic.clickIcon = clickIcon || pwa.arabic.clickIcon;
        pwa.arabic.pressIcon = pressIcon || pwa.arabic.pressIcon;
        pwa.arabic.step1ChromeDesktop =
          step1ChromeDesktop || pwa.arabic.step1ChromeDesktop;
        pwa.arabic.step2ChromeDesktop =
          step2ChromeDesktop || pwa.arabic.step2ChromeDesktop;
        pwa.arabic.step1SafariDesktop =
          step1SafariDesktop || pwa.arabic.step1SafariDesktop;
        pwa.arabic.step2SafariDesktop =
          step2SafariDesktop || pwa.arabic.step2SafariDesktop;
        pwa.arabic.step3SafariDesktop =
          step3SafariDesktop || pwa.arabic.step3SafariDesktop;
        pwa.arabic.step1ChromeMobile =
          step1ChromeMobile || pwa.arabic.step1ChromeMobile;
        pwa.arabic.step2ChromeMobile =
          step2ChromeMobile || pwa.arabic.step2ChromeMobile;
        pwa.arabic.step3ChromeMobile =
          step3ChromeMobile || pwa.arabic.step3ChromeMobile;
        pwa.arabic.step1SafariMobile =
          step1SafariMobile || pwa.arabic.step1SafariMobile;
        pwa.arabic.step2SafariMobile =
          step2SafariMobile || pwa.arabic.step2SafariMobile;
        pwa.arabic.step3SafariMobile =
          step3SafariMobile || pwa.arabic.step3SafariMobile;
        pwa.arabic.greeting = greeting || pwa.arabic.greeting;
        pwa.arabic.wait = wait || pwa.arabic.wait;
        pwa.arabic.proceed = proceed || pwa.arabic.proceed;
        pwa.arabic.description = description || pwa.arabic.description;
        pwa.arabic.containsAds = containsAds || pwa.arabic.containsAds;
        pwa.arabic.inAppPurchases = inAppPurchases || pwa.arabic.inAppPurchases;
        pwa.arabic.headerReviews = headerReviews || pwa.arabic.headerReviews;
        pwa.arabic.hundredPlus = hundredPlus || pwa.arabic.hundredPlus;
        pwa.arabic.downloads = downloads || pwa.arabic.downloads;
        pwa.arabic.ageLimit = ageLimit || pwa.arabic.ageLimit;
        pwa.arabic.ageRating = ageRating || pwa.arabic.ageRating;
        pwa.arabic.install = install || pwa.arabic.install;
        pwa.arabic.wishlist = wishlist || pwa.arabic.wishlist;
        pwa.arabic.available = available || pwa.arabic.available;
        pwa.arabic.aboutThisGame = aboutThisGame || pwa.arabic.aboutThisGame;
        pwa.arabic.about1 = about1 || pwa.arabic.about1;
        pwa.arabic.about2 = about2 || pwa.arabic.about2;
        pwa.arabic.about3 = about3 || pwa.arabic.about3;
        pwa.arabic.updatedOn = updatedOn || pwa.arabic.updatedOn;
        pwa.arabic.updatedDate = updatedDate || pwa.arabic.updatedDate;
        pwa.arabic.casino = casino || pwa.arabic.casino;
        pwa.arabic.dataSafety = dataSafety || pwa.arabic.dataSafety;
        pwa.arabic.safety = safety || pwa.arabic.safety;
        pwa.arabic.noInformation = noInformation || pwa.arabic.noInformation;
        pwa.arabic.seeDetails = seeDetails || pwa.arabic.seeDetails;
        pwa.arabic.ratingsAndReviews =
          ratingsAndReviews || pwa.arabic.ratingsAndReviews;
        pwa.arabic.verified = verified || pwa.arabic.verified;
        pwa.arabic.phone = phone || pwa.arabic.phone;
        pwa.arabic.tV = tV || pwa.arabic.tV;
        pwa.arabic.chromebook = chromebook || pwa.arabic.chromebook;
        pwa.arabic.tablet = tablet || pwa.arabic.tablet;
        pwa.arabic.reviews = reviews || pwa.arabic.reviews;
        pwa.arabic.fourPointThree = fourPointThree || pwa.arabic.fourPointThree;
        pwa.arabic.fifteenM = fifteenM || pwa.arabic.fifteenM;
        pwa.arabic.review1 = review1 || pwa.arabic.review1;
        pwa.arabic.review2 = review2 || pwa.arabic.review2;
        pwa.arabic.review3 = review3 || pwa.arabic.review3;
        pwa.arabic.review4 = review4 || pwa.arabic.review4;
        pwa.arabic.allReviews = allReviews || pwa.arabic.allReviews;
        pwa.arabic.whatsNew = whatsNew || pwa.arabic.whatsNew;
        pwa.arabic.findHelpful = findHelpful || pwa.arabic.findHelpful;
        pwa.arabic.yes = yes || pwa.arabic.yes;
        pwa.arabic.no = no || pwa.arabic.no;
        pwa.arabic.contact = contact || pwa.arabic.contact;
        //=========================================================================
        pwa.arabic.icon = icon || pwa.arabic.icon;
        pwa.arabic.screenShots = screenShots || pwa.arabic.screenShots;
        pwa.arabic.fallBackScreenShots =
          fallBackScreenShots || pwa.arabic.fallBackScreenShots;
        pwa.arabic.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.arabic.backgroundPhotoMobile;
        pwa.arabic.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.arabic.backgroundPhotoDesktop;
        pwa.arabic.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.arabic.fallBackBackgroundPhotoMobile;
        pwa.arabic.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.arabic.fallBackBackgroundPhotoDesktop;
        pwa.arabic.logo = logo || pwa.arabic.logo;
        pwa.arabic.appTitle = appTitle || pwa.arabic.appTitle;
        pwa.arabic.appSubTitle = appSubTitle || pwa.arabic.appSubTitle;

        //=========================================================================

        updatedPWA = await pwa.save();
      }

      if (language === "Chinese") {
        pwa.chinese.open = open || pwa.chinese.open;
        pwa.chinese.stayOn = stayOn || pwa.chinese.stayOn;
        pwa.chinese.add = add || pwa.chinese.add;
        pwa.chinese.clickIcon = clickIcon || pwa.chinese.clickIcon;
        pwa.chinese.pressIcon = pressIcon || pwa.chinese.pressIcon;
        pwa.chinese.step1ChromeDesktop =
          step1ChromeDesktop || pwa.chinese.step1ChromeDesktop;
        pwa.chinese.step2ChromeDesktop =
          step2ChromeDesktop || pwa.chinese.step2ChromeDesktop;
        pwa.chinese.step1SafariDesktop =
          step1SafariDesktop || pwa.chinese.step1SafariDesktop;
        pwa.chinese.step2SafariDesktop =
          step2SafariDesktop || pwa.chinese.step2SafariDesktop;
        pwa.chinese.step3SafariDesktop =
          step3SafariDesktop || pwa.chinese.step3SafariDesktop;
        pwa.chinese.step1ChromeMobile =
          step1ChromeMobile || pwa.chinese.step1ChromeMobile;
        pwa.chinese.step2ChromeMobile =
          step2ChromeMobile || pwa.chinese.step2ChromeMobile;
        pwa.chinese.step3ChromeMobile =
          step3ChromeMobile || pwa.chinese.step3ChromeMobile;
        pwa.chinese.step1SafariMobile =
          step1SafariMobile || pwa.chinese.step1SafariMobile;
        pwa.chinese.step2SafariMobile =
          step2SafariMobile || pwa.chinese.step2SafariMobile;
        pwa.chinese.step3SafariMobile =
          step3SafariMobile || pwa.chinese.step3SafariMobile;
        pwa.chinese.greeting = greeting || pwa.chinese.greeting;
        pwa.chinese.wait = wait || pwa.chinese.wait;
        pwa.chinese.proceed = proceed || pwa.chinese.proceed;
        pwa.chinese.description = description || pwa.chinese.description;
        pwa.chinese.containsAds = containsAds || pwa.chinese.containsAds;
        pwa.chinese.inAppPurchases =
          inAppPurchases || pwa.chinese.inAppPurchases;
        pwa.chinese.headerReviews = headerReviews || pwa.chinese.headerReviews;
        pwa.chinese.hundredPlus = hundredPlus || pwa.chinese.hundredPlus;
        pwa.chinese.downloads = downloads || pwa.chinese.downloads;
        pwa.chinese.ageLimit = ageLimit || pwa.chinese.ageLimit;
        pwa.chinese.ageRating = ageRating || pwa.chinese.ageRating;
        pwa.chinese.install = install || pwa.chinese.install;
        pwa.chinese.wishlist = wishlist || pwa.chinese.wishlist;
        pwa.chinese.available = available || pwa.chinese.available;
        pwa.chinese.aboutThisGame = aboutThisGame || pwa.chinese.aboutThisGame;
        pwa.chinese.about1 = about1 || pwa.chinese.about1;
        pwa.chinese.about2 = about2 || pwa.chinese.about2;
        pwa.chinese.about3 = about3 || pwa.chinese.about3;
        pwa.chinese.updatedOn = updatedOn || pwa.chinese.updatedOn;
        pwa.chinese.updatedDate = updatedDate || pwa.chinese.updatedDate;
        pwa.chinese.casino = casino || pwa.chinese.casino;
        pwa.chinese.dataSafety = dataSafety || pwa.chinese.dataSafety;
        pwa.chinese.safety = safety || pwa.chinese.safety;
        pwa.chinese.noInformation = noInformation || pwa.chinese.noInformation;
        pwa.chinese.seeDetails = seeDetails || pwa.chinese.seeDetails;
        pwa.chinese.ratingsAndReviews =
          ratingsAndReviews || pwa.chinese.ratingsAndReviews;
        pwa.chinese.verified = verified || pwa.chinese.verified;
        pwa.chinese.phone = phone || pwa.chinese.phone;
        pwa.chinese.tV = tV || pwa.chinese.tV;
        pwa.chinese.chromebook = chromebook || pwa.chinese.chromebook;
        pwa.chinese.tablet = tablet || pwa.chinese.tablet;
        pwa.chinese.reviews = reviews || pwa.chinese.reviews;
        pwa.chinese.fourPointThree =
          fourPointThree || pwa.chinese.fourPointThree;
        pwa.chinese.fifteenM = fifteenM || pwa.chinese.fifteenM;
        pwa.chinese.review1 = review1 || pwa.chinese.review1;
        pwa.chinese.review2 = review2 || pwa.chinese.review2;
        pwa.chinese.review3 = review3 || pwa.chinese.review3;
        pwa.chinese.review4 = review4 || pwa.chinese.review4;
        pwa.chinese.allReviews = allReviews || pwa.chinese.allReviews;
        pwa.chinese.whatsNew = whatsNew || pwa.chinese.whatsNew;
        pwa.chinese.findHelpful = findHelpful || pwa.chinese.findHelpful;
        pwa.chinese.yes = yes || pwa.chinese.yes;
        pwa.chinese.no = no || pwa.chinese.no;
        pwa.chinese.contact = contact || pwa.chinese.contact;
        pwa.chinese.icon = icon || pwa.chinese.icon;
        pwa.chinese.screenShots = screenShots || pwa.chinese.screenShots;
        pwa.chinese.fallBackScreenShots =
          fallBackScreenShots || pwa.chinese.fallBackScreenShots;
        pwa.chinese.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.chinese.backgroundPhotoMobile;
        pwa.chinese.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.chinese.backgroundPhotoDesktop;
        pwa.chinese.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.chinese.fallBackBackgroundPhotoMobile;
        pwa.chinese.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.chinese.fallBackBackgroundPhotoDesktop;
        pwa.chinese.logo = logo || pwa.chinese.logo;
        pwa.chinese.appTitle = appTitle || pwa.chinese.appTitle;
        pwa.chinese.appSubTitle = appSubTitle || pwa.chinese.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Dutch") {
        pwa.dutch.open = open || pwa.dutch.open;
        pwa.dutch.stayOn = stayOn || pwa.dutch.stayOn;
        pwa.dutch.add = add || pwa.dutch.add;
        pwa.dutch.clickIcon = clickIcon || pwa.dutch.clickIcon;
        pwa.dutch.pressIcon = pressIcon || pwa.dutch.pressIcon;
        pwa.dutch.step1ChromeDesktop =
          step1ChromeDesktop || pwa.dutch.step1ChromeDesktop;
        pwa.dutch.step2ChromeDesktop =
          step2ChromeDesktop || pwa.dutch.step2ChromeDesktop;
        pwa.dutch.step1SafariDesktop =
          step1SafariDesktop || pwa.dutch.step1SafariDesktop;
        pwa.dutch.step2SafariDesktop =
          step2SafariDesktop || pwa.dutch.step2SafariDesktop;
        pwa.dutch.step3SafariDesktop =
          step3SafariDesktop || pwa.dutch.step3SafariDesktop;
        pwa.dutch.step1ChromeMobile =
          step1ChromeMobile || pwa.dutch.step1ChromeMobile;
        pwa.dutch.step2ChromeMobile =
          step2ChromeMobile || pwa.dutch.step2ChromeMobile;
        pwa.dutch.step3ChromeMobile =
          step3ChromeMobile || pwa.dutch.step3ChromeMobile;
        pwa.dutch.step1SafariMobile =
          step1SafariMobile || pwa.dutch.step1SafariMobile;
        pwa.dutch.step2SafariMobile =
          step2SafariMobile || pwa.dutch.step2SafariMobile;
        pwa.dutch.step3SafariMobile =
          step3SafariMobile || pwa.dutch.step3SafariMobile;
        pwa.dutch.greeting = greeting || pwa.dutch.greeting;
        pwa.dutch.wait = wait || pwa.dutch.wait;
        pwa.dutch.proceed = proceed || pwa.dutch.proceed;
        pwa.dutch.description = description || pwa.dutch.description;
        pwa.dutch.containsAds = containsAds || pwa.dutch.containsAds;
        pwa.dutch.inAppPurchases = inAppPurchases || pwa.dutch.inAppPurchases;
        pwa.dutch.headerReviews = headerReviews || pwa.dutch.headerReviews;
        pwa.dutch.hundredPlus = hundredPlus || pwa.dutch.hundredPlus;
        pwa.dutch.downloads = downloads || pwa.dutch.downloads;
        pwa.dutch.ageLimit = ageLimit || pwa.dutch.ageLimit;
        pwa.dutch.ageRating = ageRating || pwa.dutch.ageRating;
        pwa.dutch.install = install || pwa.dutch.install;
        pwa.dutch.wishlist = wishlist || pwa.dutch.wishlist;
        pwa.dutch.available = available || pwa.dutch.available;
        pwa.dutch.aboutThisGame = aboutThisGame || pwa.dutch.aboutThisGame;
        pwa.dutch.about1 = about1 || pwa.dutch.about1;
        pwa.dutch.about2 = about2 || pwa.dutch.about2;
        pwa.dutch.about3 = about3 || pwa.dutch.about3;
        pwa.dutch.updatedOn = updatedOn || pwa.dutch.updatedOn;
        pwa.dutch.updatedDate = updatedDate || pwa.dutch.updatedDate;
        pwa.dutch.casino = casino || pwa.dutch.casino;
        pwa.dutch.dataSafety = dataSafety || pwa.dutch.dataSafety;
        pwa.dutch.safety = safety || pwa.dutch.safety;
        pwa.dutch.noInformation = noInformation || pwa.dutch.noInformation;
        pwa.dutch.seeDetails = seeDetails || pwa.dutch.seeDetails;
        pwa.dutch.ratingsAndReviews =
          ratingsAndReviews || pwa.dutch.ratingsAndReviews;
        pwa.dutch.verified = verified || pwa.dutch.verified;
        pwa.dutch.phone = phone || pwa.dutch.phone;
        pwa.dutch.tV = tV || pwa.dutch.tV;
        pwa.dutch.chromebook = chromebook || pwa.dutch.chromebook;
        pwa.dutch.tablet = tablet || pwa.dutch.tablet;
        pwa.dutch.reviews = reviews || pwa.dutch.reviews;
        pwa.dutch.fourPointThree = fourPointThree || pwa.dutch.fourPointThree;
        pwa.dutch.fifteenM = fifteenM || pwa.dutch.fifteenM;
        pwa.dutch.review1 = review1 || pwa.dutch.review1;
        pwa.dutch.review2 = review2 || pwa.dutch.review2;
        pwa.dutch.review3 = review3 || pwa.dutch.review3;
        pwa.dutch.review4 = review4 || pwa.dutch.review4;
        pwa.dutch.allReviews = allReviews || pwa.dutch.allReviews;
        pwa.dutch.whatsNew = whatsNew || pwa.dutch.whatsNew;
        pwa.dutch.findHelpful = findHelpful || pwa.dutch.findHelpful;
        pwa.dutch.yes = yes || pwa.dutch.yes;
        pwa.dutch.no = no || pwa.dutch.no;
        pwa.dutch.contact = contact || pwa.dutch.contact;
        pwa.arabic.icon = icon || pwa.arabic.icon;
        pwa.dutch.screenShots = screenShots || pwa.dutch.screenShots;
        pwa.dutch.fallBackScreenShots =
          fallBackScreenShots || pwa.dutch.fallBackScreenShots;
        pwa.dutch.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.dutch.backgroundPhotoMobile;
        pwa.dutch.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.dutch.backgroundPhotoDesktop;
        pwa.dutch.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.dutch.fallBackBackgroundPhotoMobile;
        pwa.dutch.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.dutch.fallBackBackgroundPhotoDesktop;
        pwa.dutch.logo = logo || pwa.dutch.logo;
        pwa.dutch.appTitle = appTitle || pwa.dutch.appTitle;
        pwa.dutch.appSubTitle = appSubTitle || pwa.dutch.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "English") {
        pwa.english.open = open || pwa.english.open;
        pwa.english.stayOn = stayOn || pwa.english.stayOn;
        pwa.english.add = add || pwa.english.add;
        pwa.english.clickIcon = clickIcon || pwa.english.clickIcon;
        pwa.english.pressIcon = pressIcon || pwa.english.pressIcon;
        pwa.english.step1ChromeDesktop =
          step1ChromeDesktop || pwa.english.step1ChromeDesktop;
        pwa.english.step2ChromeDesktop =
          step2ChromeDesktop || pwa.english.step2ChromeDesktop;
        pwa.english.step1SafariDesktop =
          step1SafariDesktop || pwa.english.step1SafariDesktop;
        pwa.english.step2SafariDesktop =
          step2SafariDesktop || pwa.english.step2SafariDesktop;
        pwa.english.step3SafariDesktop =
          step3SafariDesktop || pwa.english.step3SafariDesktop;
        pwa.english.step1ChromeMobile =
          step1ChromeMobile || pwa.english.step1ChromeMobile;
        pwa.english.step2ChromeMobile =
          step2ChromeMobile || pwa.english.step2ChromeMobile;
        pwa.english.step3ChromeMobile =
          step3ChromeMobile || pwa.english.step3ChromeMobile;
        pwa.english.step1SafariMobile =
          step1SafariMobile || pwa.english.step1SafariMobile;
        pwa.english.step2SafariMobile =
          step2SafariMobile || pwa.english.step2SafariMobile;
        pwa.english.step3SafariMobile =
          step3SafariMobile || pwa.english.step3SafariMobile;
        pwa.english.greeting = greeting || pwa.english.greeting;
        pwa.english.wait = wait || pwa.english.wait;
        pwa.english.proceed = proceed || pwa.english.proceed;
        pwa.english.description = description || pwa.english.description;
        pwa.english.containsAds = containsAds || pwa.english.containsAds;
        pwa.english.inAppPurchases =
          inAppPurchases || pwa.english.inAppPurchases;
        pwa.english.headerReviews = headerReviews || pwa.english.headerReviews;
        pwa.english.hundredPlus = hundredPlus || pwa.english.hundredPlus;
        pwa.english.downloads = downloads || pwa.english.downloads;
        pwa.english.ageLimit = ageLimit || pwa.english.ageLimit;
        pwa.english.ageRating = ageRating || pwa.english.ageRating;
        pwa.english.install = install || pwa.english.install;
        pwa.english.wishlist = wishlist || pwa.english.wishlist;
        pwa.english.available = available || pwa.english.available;
        pwa.english.aboutThisGame = aboutThisGame || pwa.english.aboutThisGame;
        pwa.english.about1 = about1 || pwa.english.about1;
        pwa.english.about2 = about2 || pwa.english.about2;
        pwa.english.about3 = about3 || pwa.english.about3;
        pwa.english.updatedOn = updatedOn || pwa.english.updatedOn;
        pwa.english.updatedDate = updatedDate || pwa.english.updatedDate;
        pwa.english.casino = casino || pwa.english.casino;
        pwa.english.dataSafety = dataSafety || pwa.english.dataSafety;
        pwa.english.safety = safety || pwa.english.safety;
        pwa.english.noInformation = noInformation || pwa.english.noInformation;
        pwa.english.seeDetails = seeDetails || pwa.english.seeDetails;
        pwa.english.ratingsAndReviews =
          ratingsAndReviews || pwa.english.ratingsAndReviews;
        pwa.english.verified = verified || pwa.english.verified;
        pwa.english.phone = phone || pwa.english.phone;
        pwa.english.tV = tV || pwa.english.tV;
        pwa.english.chromebook = chromebook || pwa.english.chromebook;
        pwa.english.tablet = tablet || pwa.english.tablet;
        pwa.english.reviews = reviews || pwa.english.reviews;
        pwa.english.fourPointThree =
          fourPointThree || pwa.english.fourPointThree;
        pwa.english.fifteenM = fifteenM || pwa.english.fifteenM;
        pwa.english.review1 = review1 || pwa.english.review1;
        pwa.english.review2 = review2 || pwa.english.review2;
        pwa.english.review3 = review3 || pwa.english.review3;
        pwa.english.review4 = review4 || pwa.english.review4;
        pwa.english.allReviews = allReviews || pwa.english.allReviews;
        pwa.english.whatsNew = whatsNew || pwa.english.whatsNew;
        pwa.english.findHelpful = findHelpful || pwa.english.findHelpful;
        pwa.english.yes = yes || pwa.english.yes;
        pwa.english.no = no || pwa.english.no;
        pwa.english.contact = contact || pwa.english.contact;
        pwa.english.icon = icon || pwa.english.icon;
        pwa.english.screenShots = screenShots || pwa.english.screenShots;
        pwa.english.fallBackScreenShots =
          fallBackScreenShots || pwa.english.fallBackScreenShots;
        pwa.english.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.english.backgroundPhotoMobile;
        pwa.english.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.english.backgroundPhotoDesktop;
        pwa.english.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.english.fallBackBackgroundPhotoMobile;
        pwa.english.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.english.fallBackBackgroundPhotoDesktop;
        pwa.english.logo = logo || pwa.english.logo;
        pwa.english.appTitle = appTitle || pwa.english.appTitle;
        pwa.english.appSubTitle = appSubTitle || pwa.english.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "French") {
        pwa.french.open = open || pwa.french.open;
        pwa.french.stayOn = stayOn || pwa.french.stayOn;
        pwa.french.add = add || pwa.french.add;
        pwa.french.clickIcon = clickIcon || pwa.french.clickIcon;
        pwa.french.pressIcon = pressIcon || pwa.french.pressIcon;
        pwa.french.step1ChromeDesktop =
          step1ChromeDesktop || pwa.french.step1ChromeDesktop;
        pwa.french.step2ChromeDesktop =
          step2ChromeDesktop || pwa.french.step2ChromeDesktop;
        pwa.french.step1SafariDesktop =
          step1SafariDesktop || pwa.french.step1SafariDesktop;
        pwa.french.step2SafariDesktop =
          step2SafariDesktop || pwa.french.step2SafariDesktop;
        pwa.french.step3SafariDesktop =
          step3SafariDesktop || pwa.french.step3SafariDesktop;
        pwa.french.step1ChromeMobile =
          step1ChromeMobile || pwa.french.step1ChromeMobile;
        pwa.french.step2ChromeMobile =
          step2ChromeMobile || pwa.french.step2ChromeMobile;
        pwa.french.step3ChromeMobile =
          step3ChromeMobile || pwa.french.step3ChromeMobile;
        pwa.french.step1SafariMobile =
          step1SafariMobile || pwa.french.step1SafariMobile;
        pwa.french.step2SafariMobile =
          step2SafariMobile || pwa.french.step2SafariMobile;
        pwa.french.step3SafariMobile =
          step3SafariMobile || pwa.french.step3SafariMobile;
        pwa.french.greeting = greeting || pwa.french.greeting;
        pwa.french.wait = wait || pwa.french.wait;
        pwa.french.proceed = proceed || pwa.french.proceed;
        pwa.french.description = description || pwa.french.description;
        pwa.french.containsAds = containsAds || pwa.french.containsAds;
        pwa.french.inAppPurchases = inAppPurchases || pwa.french.inAppPurchases;
        pwa.french.headerReviews = headerReviews || pwa.french.headerReviews;
        pwa.french.hundredPlus = hundredPlus || pwa.french.hundredPlus;
        pwa.french.downloads = downloads || pwa.french.downloads;
        pwa.french.ageLimit = ageLimit || pwa.french.ageLimit;
        pwa.french.ageRating = ageRating || pwa.french.ageRating;
        pwa.french.install = install || pwa.french.install;
        pwa.french.wishlist = wishlist || pwa.french.wishlist;
        pwa.french.available = available || pwa.french.available;
        pwa.french.aboutThisGame = aboutThisGame || pwa.french.aboutThisGame;
        pwa.french.about1 = about1 || pwa.french.about1;
        pwa.french.about2 = about2 || pwa.french.about2;
        pwa.french.about3 = about3 || pwa.french.about3;
        pwa.french.updatedOn = updatedOn || pwa.french.updatedOn;
        pwa.french.updatedDate = updatedDate || pwa.french.updatedDate;
        pwa.french.casino = casino || pwa.french.casino;
        pwa.french.dataSafety = dataSafety || pwa.french.dataSafety;
        pwa.french.safety = safety || pwa.french.safety;
        pwa.french.noInformation = noInformation || pwa.french.noInformation;
        pwa.french.seeDetails = seeDetails || pwa.french.seeDetails;
        pwa.french.ratingsAndReviews =
          ratingsAndReviews || pwa.french.ratingsAndReviews;
        pwa.french.verified = verified || pwa.french.verified;
        pwa.french.phone = phone || pwa.french.phone;
        pwa.french.tV = tV || pwa.french.tV;
        pwa.french.chromebook = chromebook || pwa.french.chromebook;
        pwa.french.tablet = tablet || pwa.french.tablet;
        pwa.french.reviews = reviews || pwa.french.reviews;
        pwa.french.fourPointThree = fourPointThree || pwa.french.fourPointThree;
        pwa.french.fifteenM = fifteenM || pwa.french.fifteenM;
        pwa.french.review1 = review1 || pwa.french.review1;
        pwa.french.review2 = review2 || pwa.french.review2;
        pwa.french.review3 = review3 || pwa.french.review3;
        pwa.french.review4 = review4 || pwa.french.review4;
        pwa.french.allReviews = allReviews || pwa.french.allReviews;
        pwa.french.whatsNew = whatsNew || pwa.french.whatsNew;
        pwa.french.findHelpful = findHelpful || pwa.french.findHelpful;
        pwa.french.yes = yes || pwa.french.yes;
        pwa.french.no = no || pwa.french.no;
        pwa.french.contact = contact || pwa.french.contact;
        pwa.french.icon = icon || pwa.french.icon;
        pwa.french.screenShots = screenShots || pwa.french.screenShots;
        pwa.french.fallBackScreenShots =
          fallBackScreenShots || pwa.french.fallBackScreenShots;
        pwa.french.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.french.backgroundPhotoMobile;
        pwa.french.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.french.backgroundPhotoDesktop;
        pwa.french.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.french.fallBackBackgroundPhotoMobile;
        pwa.french.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.french.fallBackBackgroundPhotoDesktop;
        pwa.french.logo = logo || pwa.french.logo;
        pwa.french.appTitle = appTitle || pwa.french.appTitle;
        pwa.french.appSubTitle = appSubTitle || pwa.french.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Indonesian") {
        pwa.indonesian.open = open || pwa.indonesian.open;
        pwa.indonesian.stayOn = stayOn || pwa.indonesian.stayOn;
        pwa.indonesian.add = add || pwa.indonesian.add;
        pwa.indonesian.clickIcon = clickIcon || pwa.indonesian.clickIcon;
        pwa.indonesian.pressIcon = pressIcon || pwa.indonesian.pressIcon;
        pwa.indonesian.step1ChromeDesktop =
          step1ChromeDesktop || pwa.indonesian.step1ChromeDesktop;
        pwa.indonesian.step2ChromeDesktop =
          step2ChromeDesktop || pwa.indonesian.step2ChromeDesktop;
        pwa.indonesian.step1SafariDesktop =
          step1SafariDesktop || pwa.indonesian.step1SafariDesktop;
        pwa.indonesian.step2SafariDesktop =
          step2SafariDesktop || pwa.indonesian.step2SafariDesktop;
        pwa.indonesian.step3SafariDesktop =
          step3SafariDesktop || pwa.indonesian.step3SafariDesktop;
        pwa.indonesian.step1ChromeMobile =
          step1ChromeMobile || pwa.indonesian.step1ChromeMobile;
        pwa.indonesian.step2ChromeMobile =
          step2ChromeMobile || pwa.indonesian.step2ChromeMobile;
        pwa.indonesian.step3ChromeMobile =
          step3ChromeMobile || pwa.indonesian.step3ChromeMobile;
        pwa.indonesian.step1SafariMobile =
          step1SafariMobile || pwa.indonesian.step1SafariMobile;
        pwa.indonesian.step2SafariMobile =
          step2SafariMobile || pwa.indonesian.step2SafariMobile;
        pwa.indonesian.step3SafariMobile =
          step3SafariMobile || pwa.indonesian.step3SafariMobile;
        pwa.indonesian.greeting = greeting || pwa.indonesian.greeting;
        pwa.indonesian.wait = wait || pwa.indonesian.wait;
        pwa.indonesian.proceed = proceed || pwa.indonesian.proceed;
        pwa.indonesian.description = description || pwa.indonesian.description;
        pwa.indonesian.containsAds = containsAds || pwa.indonesian.containsAds;
        pwa.indonesian.inAppPurchases =
          inAppPurchases || pwa.indonesian.inAppPurchases;
        pwa.indonesian.headerReviews =
          headerReviews || pwa.indonesian.headerReviews;
        pwa.indonesian.hundredPlus = hundredPlus || pwa.indonesian.hundredPlus;
        pwa.indonesian.downloads = downloads || pwa.indonesian.downloads;
        pwa.indonesian.ageLimit = ageLimit || pwa.indonesian.ageLimit;
        pwa.indonesian.ageRating = ageRating || pwa.indonesian.ageRating;
        pwa.indonesian.install = install || pwa.indonesian.install;
        pwa.indonesian.wishlist = wishlist || pwa.indonesian.wishlist;
        pwa.indonesian.available = available || pwa.indonesian.available;
        pwa.indonesian.aboutThisGame =
          aboutThisGame || pwa.indonesian.aboutThisGame;
        pwa.indonesian.about1 = about1 || pwa.indonesian.about1;
        pwa.indonesian.about2 = about2 || pwa.indonesian.about2;
        pwa.indonesian.about3 = about3 || pwa.indonesian.about3;
        pwa.indonesian.updatedOn = updatedOn || pwa.indonesian.updatedOn;
        pwa.indonesian.updatedDate = updatedDate || pwa.indonesian.updatedDate;
        pwa.indonesian.casino = casino || pwa.indonesian.casino;
        pwa.indonesian.dataSafety = dataSafety || pwa.indonesian.dataSafety;
        pwa.indonesian.safety = safety || pwa.indonesian.safety;
        pwa.indonesian.noInformation =
          noInformation || pwa.indonesian.noInformation;
        pwa.indonesian.seeDetails = seeDetails || pwa.indonesian.seeDetails;
        pwa.indonesian.ratingsAndReviews =
          ratingsAndReviews || pwa.indonesian.ratingsAndReviews;
        pwa.indonesian.verified = verified || pwa.indonesian.verified;
        pwa.indonesian.phone = phone || pwa.indonesian.phone;
        pwa.indonesian.tV = tV || pwa.indonesian.tV;
        pwa.indonesian.chromebook = chromebook || pwa.indonesian.chromebook;
        pwa.indonesian.tablet = tablet || pwa.indonesian.tablet;
        pwa.indonesian.reviews = reviews || pwa.indonesian.reviews;
        pwa.indonesian.fourPointThree =
          fourPointThree || pwa.indonesian.fourPointThree;
        pwa.indonesian.fifteenM = fifteenM || pwa.indonesian.fifteenM;
        pwa.indonesian.review1 = review1 || pwa.indonesian.review1;
        pwa.indonesian.review2 = review2 || pwa.indonesian.review2;
        pwa.indonesian.review3 = review3 || pwa.indonesian.review3;
        pwa.indonesian.review4 = review4 || pwa.indonesian.review4;
        pwa.indonesian.allReviews = allReviews || pwa.indonesian.allReviews;
        pwa.indonesian.whatsNew = whatsNew || pwa.indonesian.whatsNew;
        pwa.indonesian.findHelpful = findHelpful || pwa.indonesian.findHelpful;
        pwa.indonesian.yes = yes || pwa.indonesian.yes;
        pwa.indonesian.no = no || pwa.indonesian.no;
        pwa.indonesian.contact = contact || pwa.indonesian.contact;
        pwa.indonesian.icon = icon || pwa.indonesian.icon;
        pwa.indonesian.screenShots = screenShots || pwa.indonesian.screenShots;
        pwa.indonesian.fallBackScreenShots =
          fallBackScreenShots || pwa.indonesian.fallBackScreenShots;
        pwa.indonesian.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.indonesian.backgroundPhotoMobile;
        pwa.indonesian.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.indonesian.backgroundPhotoDesktop;
        pwa.indonesian.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.indonesian.fallBackBackgroundPhotoMobile;
        pwa.indonesian.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.indonesian.fallBackBackgroundPhotoDesktop;
        pwa.indonesian.logo = logo || pwa.indonesian.logo;
        pwa.indonesian.appTitle = appTitle || pwa.indonesian.appTitle;
        pwa.indonesian.appSubTitle = appSubTitle || pwa.indonesian.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Urdu") {
        pwa.urdu.open = open || pwa.urdu.open;
        pwa.urdu.stayOn = stayOn || pwa.urdu.stayOn;
        pwa.urdu.add = add || pwa.urdu.add;
        pwa.urdu.clickIcon = clickIcon || pwa.urdu.clickIcon;
        pwa.urdu.pressIcon = pressIcon || pwa.urdu.pressIcon;
        pwa.urdu.step1ChromeDesktop =
          step1ChromeDesktop || pwa.urdu.step1ChromeDesktop;
        pwa.urdu.step2ChromeDesktop =
          step2ChromeDesktop || pwa.urdu.step2ChromeDesktop;
        pwa.urdu.step1SafariDesktop =
          step1SafariDesktop || pwa.urdu.step1SafariDesktop;
        pwa.urdu.step2SafariDesktop =
          step2SafariDesktop || pwa.urdu.step2SafariDesktop;
        pwa.urdu.step3SafariDesktop =
          step3SafariDesktop || pwa.urdu.step3SafariDesktop;
        pwa.urdu.step1ChromeMobile =
          step1ChromeMobile || pwa.urdu.step1ChromeMobile;
        pwa.urdu.step2ChromeMobile =
          step2ChromeMobile || pwa.urdu.step2ChromeMobile;
        pwa.urdu.step3ChromeMobile =
          step3ChromeMobile || pwa.urdu.step3ChromeMobile;
        pwa.urdu.step1SafariMobile =
          step1SafariMobile || pwa.urdu.step1SafariMobile;
        pwa.urdu.step2SafariMobile =
          step2SafariMobile || pwa.urdu.step2SafariMobile;
        pwa.urdu.step3SafariMobile =
          step3SafariMobile || pwa.urdu.step3SafariMobile;
        pwa.urdu.greeting = greeting || pwa.urdu.greeting;
        pwa.urdu.wait = wait || pwa.urdu.wait;
        pwa.urdu.proceed = proceed || pwa.urdu.proceed;
        pwa.urdu.description = description || pwa.urdu.description;
        pwa.urdu.containsAds = containsAds || pwa.urdu.containsAds;
        pwa.urdu.inAppPurchases = inAppPurchases || pwa.urdu.inAppPurchases;
        pwa.urdu.headerReviews = headerReviews || pwa.urdu.headerReviews;
        pwa.urdu.hundredPlus = hundredPlus || pwa.urdu.hundredPlus;
        pwa.urdu.downloads = downloads || pwa.urdu.downloads;
        pwa.urdu.ageLimit = ageLimit || pwa.urdu.ageLimit;
        pwa.urdu.ageRating = ageRating || pwa.urdu.ageRating;
        pwa.urdu.install = install || pwa.urdu.install;
        pwa.urdu.wishlist = wishlist || pwa.urdu.wishlist;
        pwa.urdu.available = available || pwa.urdu.available;
        pwa.urdu.aboutThisGame = aboutThisGame || pwa.urdu.aboutThisGame;
        pwa.urdu.about1 = about1 || pwa.urdu.about1;
        pwa.urdu.about2 = about2 || pwa.urdu.about2;
        pwa.urdu.about3 = about3 || pwa.urdu.about3;
        pwa.urdu.updatedOn = updatedOn || pwa.urdu.updatedOn;
        pwa.urdu.updatedDate = updatedDate || pwa.urdu.updatedDate;
        pwa.urdu.casino = casino || pwa.urdu.casino;
        pwa.urdu.dataSafety = dataSafety || pwa.urdu.dataSafety;
        pwa.urdu.safety = safety || pwa.urdu.safety;
        pwa.urdu.noInformation = noInformation || pwa.urdu.noInformation;
        pwa.urdu.seeDetails = seeDetails || pwa.urdu.seeDetails;
        pwa.urdu.ratingsAndReviews =
          ratingsAndReviews || pwa.urdu.ratingsAndReviews;
        pwa.urdu.verified = verified || pwa.urdu.verified;
        pwa.urdu.phone = phone || pwa.urdu.phone;
        pwa.urdu.tV = tV || pwa.urdu.tV;
        pwa.urdu.chromebook = chromebook || pwa.urdu.chromebook;
        pwa.urdu.tablet = tablet || pwa.urdu.tablet;
        pwa.urdu.reviews = reviews || pwa.urdu.reviews;
        pwa.urdu.fourPointThree = fourPointThree || pwa.urdu.fourPointThree;
        pwa.urdu.fifteenM = fifteenM || pwa.urdu.fifteenM;
        pwa.urdu.review1 = review1 || pwa.urdu.review1;
        pwa.urdu.review2 = review2 || pwa.urdu.review2;
        pwa.urdu.review3 = review3 || pwa.urdu.review3;
        pwa.urdu.review4 = review4 || pwa.urdu.review4;
        pwa.urdu.allReviews = allReviews || pwa.urdu.allReviews;
        pwa.urdu.whatsNew = whatsNew || pwa.urdu.whatsNew;
        pwa.urdu.findHelpful = findHelpful || pwa.urdu.findHelpful;
        pwa.urdu.yes = yes || pwa.urdu.yes;
        pwa.urdu.no = no || pwa.urdu.no;
        pwa.urdu.contact = contact || pwa.urdu.contact;
        pwa.urdu.icon = icon || pwa.urdu.icon;
        pwa.urdu.screenShots = screenShots || pwa.urdu.screenShots;
        pwa.urdu.fallBackScreenShots =
          fallBackScreenShots || pwa.urdu.fallBackScreenShots;
        pwa.urdu.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.urdu.backgroundPhotoMobile;
        pwa.urdu.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.urdu.backgroundPhotoDesktop;
        pwa.urdu.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.urdu.fallBackBackgroundPhotoMobile;
        pwa.urdu.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.urdu.fallBackBackgroundPhotoDesktop;
        pwa.urdu.logo = logo || pwa.urdu.logo;
        pwa.urdu.appTitle = appTitle || pwa.urdu.appTitle;
        pwa.urdu.appSubTitle = appSubTitle || pwa.urdu.appSubTitle;

        updatedPWA = await pwa.save();
      }
      if (language === "Korean") {
        pwa.korean.open = open || pwa.korean.open;
        pwa.korean.stayOn = stayOn || pwa.korean.stayOn;
        pwa.korean.add = add || pwa.korean.add;
        pwa.korean.clickIcon = clickIcon || pwa.korean.clickIcon;
        pwa.korean.pressIcon = pressIcon || pwa.korean.pressIcon;
        pwa.korean.step1ChromeDesktop =
          step1ChromeDesktop || pwa.korean.step1ChromeDesktop;
        pwa.korean.step2ChromeDesktop =
          step2ChromeDesktop || pwa.korean.step2ChromeDesktop;
        pwa.korean.step1SafariDesktop =
          step1SafariDesktop || pwa.korean.step1SafariDesktop;
        pwa.korean.step2SafariDesktop =
          step2SafariDesktop || pwa.korean.step2SafariDesktop;
        pwa.korean.step3SafariDesktop =
          step3SafariDesktop || pwa.korean.step3SafariDesktop;
        pwa.korean.step1ChromeMobile =
          step1ChromeMobile || pwa.korean.step1ChromeMobile;
        pwa.korean.step2ChromeMobile =
          step2ChromeMobile || pwa.korean.step2ChromeMobile;
        pwa.korean.step3ChromeMobile =
          step3ChromeMobile || pwa.korean.step3ChromeMobile;
        pwa.korean.step1SafariMobile =
          step1SafariMobile || pwa.korean.step1SafariMobile;
        pwa.korean.step2SafariMobile =
          step2SafariMobile || pwa.korean.step2SafariMobile;
        pwa.korean.step3SafariMobile =
          step3SafariMobile || pwa.korean.step3SafariMobile;
        pwa.korean.greeting = greeting || pwa.korean.greeting;
        pwa.korean.wait = wait || pwa.korean.wait;
        pwa.korean.proceed = proceed || pwa.korean.proceed;
        pwa.korean.description = description || pwa.korean.description;
        pwa.korean.containsAds = containsAds || pwa.korean.containsAds;
        pwa.korean.inAppPurchases = inAppPurchases || pwa.korean.inAppPurchases;
        pwa.korean.headerReviews = headerReviews || pwa.korean.headerReviews;
        pwa.korean.hundredPlus = hundredPlus || pwa.korean.hundredPlus;
        pwa.korean.downloads = downloads || pwa.korean.downloads;
        pwa.korean.ageLimit = ageLimit || pwa.korean.ageLimit;
        pwa.korean.ageRating = ageRating || pwa.korean.ageRating;
        pwa.korean.install = install || pwa.korean.install;
        pwa.korean.wishlist = wishlist || pwa.korean.wishlist;
        pwa.korean.available = available || pwa.korean.available;
        pwa.korean.aboutThisGame = aboutThisGame || pwa.korean.aboutThisGame;
        pwa.korean.about1 = about1 || pwa.korean.about1;
        pwa.korean.about2 = about2 || pwa.korean.about2;
        pwa.korean.about3 = about3 || pwa.korean.about3;
        pwa.korean.updatedOn = updatedOn || pwa.korean.updatedOn;
        pwa.korean.updatedDate = updatedDate || pwa.korean.updatedDate;
        pwa.korean.casino = casino || pwa.korean.casino;
        pwa.korean.dataSafety = dataSafety || pwa.korean.dataSafety;
        pwa.korean.safety = safety || pwa.korean.safety;
        pwa.korean.noInformation = noInformation || pwa.korean.noInformation;
        pwa.korean.seeDetails = seeDetails || pwa.korean.seeDetails;
        pwa.korean.ratingsAndReviews =
          ratingsAndReviews || pwa.korean.ratingsAndReviews;
        pwa.korean.verified = verified || pwa.korean.verified;
        pwa.korean.phone = phone || pwa.korean.phone;
        pwa.korean.tV = tV || pwa.korean.tV;
        pwa.korean.chromebook = chromebook || pwa.korean.chromebook;
        pwa.korean.tablet = tablet || pwa.korean.tablet;
        pwa.korean.reviews = reviews || pwa.korean.reviews;
        pwa.korean.fourPointThree = fourPointThree || pwa.korean.fourPointThree;
        pwa.korean.fifteenM = fifteenM || pwa.korean.fifteenM;
        pwa.korean.review1 = review1 || pwa.korean.review1;
        pwa.korean.review2 = review2 || pwa.korean.review2;
        pwa.korean.review3 = review3 || pwa.korean.review3;
        pwa.korean.review4 = review4 || pwa.korean.review4;
        pwa.korean.allReviews = allReviews || pwa.korean.allReviews;
        pwa.korean.whatsNew = whatsNew || pwa.korean.whatsNew;
        pwa.korean.findHelpful = findHelpful || pwa.korean.findHelpful;
        pwa.korean.yes = yes || pwa.korean.yes;
        pwa.korean.no = no || pwa.korean.no;
        pwa.korean.contact = contact || pwa.korean.contact;
        pwa.korean.icon = icon || pwa.korean.icon;
        pwa.korean.screenShots = screenShots || pwa.korean.screenShots;
        pwa.korean.fallBackScreenShots =
          fallBackScreenShots || pwa.korean.fallBackScreenShots;
        pwa.korean.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.korean.backgroundPhotoMobile;
        pwa.korean.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.korean.backgroundPhotoDesktop;
        pwa.korean.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.korean.fallBackBackgroundPhotoMobile;
        pwa.korean.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.korean.fallBackBackgroundPhotoDesktop;
        pwa.korean.logo = logo || pwa.korean.logo;
        pwa.korean.appTitle = appTitle || pwa.korean.appTitle;
        pwa.korean.appSubTitle = appSubTitle || pwa.korean.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Russian") {
        pwa.russian.open = open || pwa.russian.open;
        pwa.russian.stayOn = stayOn || pwa.russian.stayOn;
        pwa.russian.add = add || pwa.russian.add;
        pwa.russian.clickIcon = clickIcon || pwa.russian.clickIcon;
        pwa.russian.pressIcon = pressIcon || pwa.russian.pressIcon;
        pwa.russian.step1ChromeDesktop =
          step1ChromeDesktop || pwa.russian.step1ChromeDesktop;
        pwa.russian.step2ChromeDesktop =
          step2ChromeDesktop || pwa.russian.step2ChromeDesktop;
        pwa.russian.step1SafariDesktop =
          step1SafariDesktop || pwa.russian.step1SafariDesktop;
        pwa.russian.step2SafariDesktop =
          step2SafariDesktop || pwa.russian.step2SafariDesktop;
        pwa.russian.step3SafariDesktop =
          step3SafariDesktop || pwa.russian.step3SafariDesktop;
        pwa.russian.step1ChromeMobile =
          step1ChromeMobile || pwa.russian.step1ChromeMobile;
        pwa.russian.step2ChromeMobile =
          step2ChromeMobile || pwa.russian.step2ChromeMobile;
        pwa.russian.step3ChromeMobile =
          step3ChromeMobile || pwa.russian.step3ChromeMobile;
        pwa.russian.step1SafariMobile =
          step1SafariMobile || pwa.russian.step1SafariMobile;
        pwa.russian.step2SafariMobile =
          step2SafariMobile || pwa.russian.step2SafariMobile;
        pwa.russian.step3SafariMobile =
          step3SafariMobile || pwa.russian.step3SafariMobile;
        pwa.russian.greeting = greeting || pwa.russian.greeting;
        pwa.russian.wait = wait || pwa.russian.wait;
        pwa.russian.proceed = proceed || pwa.russian.proceed;
        pwa.russian.description = description || pwa.russian.description;
        pwa.russian.containsAds = containsAds || pwa.russian.containsAds;
        pwa.russian.inAppPurchases =
          inAppPurchases || pwa.russian.inAppPurchases;
        pwa.russian.headerReviews = headerReviews || pwa.russian.headerReviews;
        pwa.russian.hundredPlus = hundredPlus || pwa.russian.hundredPlus;
        pwa.russian.downloads = downloads || pwa.russian.downloads;
        pwa.russian.ageLimit = ageLimit || pwa.russian.ageLimit;
        pwa.russian.ageRating = ageRating || pwa.russian.ageRating;
        pwa.russian.install = install || pwa.russian.install;
        pwa.russian.wishlist = wishlist || pwa.russian.wishlist;
        pwa.russian.available = available || pwa.russian.available;
        pwa.russian.aboutThisGame = aboutThisGame || pwa.russian.aboutThisGame;
        pwa.russian.about1 = about1 || pwa.russian.about1;
        pwa.russian.about2 = about2 || pwa.russian.about2;
        pwa.russian.about3 = about3 || pwa.russian.about3;
        pwa.russian.updatedOn = updatedOn || pwa.russian.updatedOn;
        pwa.russian.updatedDate = updatedDate || pwa.russian.updatedDate;
        pwa.russian.casino = casino || pwa.russian.casino;
        pwa.russian.dataSafety = dataSafety || pwa.russian.dataSafety;
        pwa.russian.safety = safety || pwa.russian.safety;
        pwa.russian.noInformation = noInformation || pwa.russian.noInformation;
        pwa.russian.seeDetails = seeDetails || pwa.russian.seeDetails;
        pwa.russian.ratingsAndReviews =
          ratingsAndReviews || pwa.russian.ratingsAndReviews;
        pwa.russian.verified = verified || pwa.russian.verified;
        pwa.russian.phone = phone || pwa.russian.phone;
        pwa.russian.tV = tV || pwa.russian.tV;
        pwa.russian.chromebook = chromebook || pwa.russian.chromebook;
        pwa.russian.tablet = tablet || pwa.russian.tablet;
        pwa.russian.reviews = reviews || pwa.russian.reviews;
        pwa.russian.fourPointThree =
          fourPointThree || pwa.russian.fourPointThree;
        pwa.russian.fifteenM = fifteenM || pwa.russian.fifteenM;
        pwa.russian.review1 = review1 || pwa.russian.review1;
        pwa.russian.review2 = review2 || pwa.russian.review2;
        pwa.russian.review3 = review3 || pwa.russian.review3;
        pwa.russian.review4 = review4 || pwa.russian.review4;
        pwa.russian.allReviews = allReviews || pwa.russian.allReviews;
        pwa.russian.whatsNew = whatsNew || pwa.russian.whatsNew;
        pwa.russian.findHelpful = findHelpful || pwa.russian.findHelpful;
        pwa.russian.yes = yes || pwa.russian.yes;
        pwa.russian.no = no || pwa.russian.no;
        pwa.russian.contact = contact || pwa.russian.contact;
        pwa.russian.icon = icon || pwa.russian.icon;
        pwa.russian.screenShots = screenShots || pwa.russian.screenShots;
        pwa.russian.fallBackScreenShots =
          fallBackScreenShots || pwa.russian.fallBackScreenShots;
        pwa.russian.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.russian.backgroundPhotoMobile;
        pwa.russian.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.russian.backgroundPhotoDesktop;
        pwa.russian.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.russian.fallBackBackgroundPhotoMobile;
        pwa.russian.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.russian.fallBackBackgroundPhotoDesktop;
        pwa.russian.logo = logo || pwa.russian.logo;
        pwa.russian.appTitle = appTitle || pwa.russian.appTitle;
        pwa.russian.appSubTitle = appSubTitle || pwa.russian.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Turkish") {
        pwa.turkish.open = open || pwa.turkish.open;
        pwa.turkish.stayOn = stayOn || pwa.turkish.stayOn;
        pwa.turkish.add = add || pwa.turkish.add;
        pwa.turkish.clickIcon = clickIcon || pwa.turkish.clickIcon;
        pwa.turkish.pressIcon = pressIcon || pwa.turkish.pressIcon;
        pwa.turkish.step1ChromeDesktop =
          step1ChromeDesktop || pwa.turkish.step1ChromeDesktop;
        pwa.turkish.step2ChromeDesktop =
          step2ChromeDesktop || pwa.turkish.step2ChromeDesktop;
        pwa.turkish.step1SafariDesktop =
          step1SafariDesktop || pwa.turkish.step1SafariDesktop;
        pwa.turkish.step2SafariDesktop =
          step2SafariDesktop || pwa.turkish.step2SafariDesktop;
        pwa.turkish.step3SafariDesktop =
          step3SafariDesktop || pwa.turkish.step3SafariDesktop;
        pwa.turkish.step1ChromeMobile =
          step1ChromeMobile || pwa.turkish.step1ChromeMobile;
        pwa.turkish.step2ChromeMobile =
          step2ChromeMobile || pwa.turkish.step2ChromeMobile;
        pwa.turkish.step3ChromeMobile =
          step3ChromeMobile || pwa.turkish.step3ChromeMobile;
        pwa.turkish.step1SafariMobile =
          step1SafariMobile || pwa.turkish.step1SafariMobile;
        pwa.turkish.step2SafariMobile =
          step2SafariMobile || pwa.turkish.step2SafariMobile;
        pwa.turkish.step3SafariMobile =
          step3SafariMobile || pwa.turkish.step3SafariMobile;
        pwa.turkish.greeting = greeting || pwa.turkish.greeting;
        pwa.turkish.wait = wait || pwa.turkish.wait;
        pwa.turkish.proceed = proceed || pwa.turkish.proceed;
        pwa.turkish.description = description || pwa.turkish.description;
        pwa.turkish.containsAds = containsAds || pwa.turkish.containsAds;
        pwa.turkish.inAppPurchases =
          inAppPurchases || pwa.turkish.inAppPurchases;
        pwa.turkish.headerReviews = headerReviews || pwa.turkish.headerReviews;
        pwa.turkish.hundredPlus = hundredPlus || pwa.turkish.hundredPlus;
        pwa.turkish.downloads = downloads || pwa.turkish.downloads;
        pwa.turkish.ageLimit = ageLimit || pwa.turkish.ageLimit;
        pwa.turkish.ageRating = ageRating || pwa.turkish.ageRating;
        pwa.turkish.install = install || pwa.turkish.install;
        pwa.turkish.wishlist = wishlist || pwa.turkish.wishlist;
        pwa.turkish.available = available || pwa.turkish.available;
        pwa.turkish.aboutThisGame = aboutThisGame || pwa.turkish.aboutThisGame;
        pwa.turkish.about1 = about1 || pwa.turkish.about1;
        pwa.turkish.about2 = about2 || pwa.turkish.about2;
        pwa.turkish.about3 = about3 || pwa.turkish.about3;
        pwa.turkish.updatedOn = updatedOn || pwa.turkish.updatedOn;
        pwa.turkish.updatedDate = updatedDate || pwa.turkish.updatedDate;
        pwa.turkish.casino = casino || pwa.turkish.casino;
        pwa.turkish.dataSafety = dataSafety || pwa.turkish.dataSafety;
        pwa.turkish.safety = safety || pwa.turkish.safety;
        pwa.turkish.noInformation = noInformation || pwa.turkish.noInformation;
        pwa.turkish.seeDetails = seeDetails || pwa.turkish.seeDetails;
        pwa.turkish.ratingsAndReviews =
          ratingsAndReviews || pwa.turkish.ratingsAndReviews;
        pwa.turkish.verified = verified || pwa.turkish.verified;
        pwa.turkish.phone = phone || pwa.turkish.phone;
        pwa.turkish.tV = tV || pwa.turkish.tV;
        pwa.turkish.chromebook = chromebook || pwa.turkish.chromebook;
        pwa.turkish.tablet = tablet || pwa.turkish.tablet;
        pwa.turkish.reviews = reviews || pwa.turkish.reviews;
        pwa.turkish.fourPointThree =
          fourPointThree || pwa.turkish.fourPointThree;
        pwa.turkish.fifteenM = fifteenM || pwa.turkish.fifteenM;
        pwa.turkish.review1 = review1 || pwa.turkish.review1;
        pwa.turkish.review2 = review2 || pwa.turkish.review2;
        pwa.turkish.review3 = review3 || pwa.turkish.review3;
        pwa.turkish.review4 = review4 || pwa.turkish.review4;
        pwa.turkish.allReviews = allReviews || pwa.turkish.allReviews;
        pwa.turkish.whatsNew = whatsNew || pwa.turkish.whatsNew;
        pwa.turkish.findHelpful = findHelpful || pwa.turkish.findHelpful;
        pwa.turkish.yes = yes || pwa.turkish.yes;
        pwa.turkish.no = no || pwa.turkish.no;
        pwa.turkish.contact = contact || pwa.turkish.contact;
        pwa.turkish.icon = icon || pwa.turkish.icon;
        pwa.turkish.screenShots = screenShots || pwa.turkish.screenShots;
        pwa.turkish.fallBackScreenShots =
          fallBackScreenShots || pwa.turkish.fallBackScreenShots;
        pwa.turkish.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.turkish.backgroundPhotoMobile;
        pwa.turkish.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.turkish.backgroundPhotoDesktop;
        pwa.turkish.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.turkish.fallBackBackgroundPhotoMobile;
        pwa.turkish.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.turkish.fallBackBackgroundPhotoDesktop;
        pwa.turkish.logo = logo || pwa.turkish.logo;
        pwa.turkish.appTitle = appTitle || pwa.turkish.appTitle;
        pwa.turkish.appSubTitle = appSubTitle || pwa.turkish.appSubTitle;
        updatedPWA = await pwa.save();
      }
      if (language === "Malay") {
        pwa.malay.open = open || pwa.malay.open;
        pwa.malay.stayOn = stayOn || pwa.malay.stayOn;
        pwa.malay.add = add || pwa.malay.add;
        pwa.malay.clickIcon = clickIcon || pwa.malay.clickIcon;
        pwa.malay.pressIcon = pressIcon || pwa.malay.pressIcon;
        pwa.malay.step1ChromeDesktop =
          step1ChromeDesktop || pwa.malay.step1ChromeDesktop;
        pwa.malay.step2ChromeDesktop =
          step2ChromeDesktop || pwa.malay.step2ChromeDesktop;
        pwa.malay.step1SafariDesktop =
          step1SafariDesktop || pwa.malay.step1SafariDesktop;
        pwa.malay.step2SafariDesktop =
          step2SafariDesktop || pwa.malay.step2SafariDesktop;
        pwa.malay.step3SafariDesktop =
          step3SafariDesktop || pwa.malay.step3SafariDesktop;
        pwa.malay.step1ChromeMobile =
          step1ChromeMobile || pwa.malay.step1ChromeMobile;
        pwa.malay.step2ChromeMobile =
          step2ChromeMobile || pwa.malay.step2ChromeMobile;
        pwa.malay.step3ChromeMobile =
          step3ChromeMobile || pwa.malay.step3ChromeMobile;
        pwa.malay.step1SafariMobile =
          step1SafariMobile || pwa.malay.step1SafariMobile;
        pwa.malay.step2SafariMobile =
          step2SafariMobile || pwa.malay.step2SafariMobile;
        pwa.malay.step3SafariMobile =
          step3SafariMobile || pwa.malay.step3SafariMobile;
        pwa.malay.greeting = greeting || pwa.malay.greeting;
        pwa.malay.wait = wait || pwa.malay.wait;
        pwa.malay.proceed = proceed || pwa.malay.proceed;
        pwa.malay.description = description || pwa.malay.description;
        pwa.malay.containsAds = containsAds || pwa.malay.containsAds;
        pwa.malay.inAppPurchases = inAppPurchases || pwa.malay.inAppPurchases;
        pwa.malay.headerReviews = headerReviews || pwa.malay.headerReviews;
        pwa.malay.hundredPlus = hundredPlus || pwa.malay.hundredPlus;
        pwa.malay.downloads = downloads || pwa.malay.downloads;
        pwa.malay.ageLimit = ageLimit || pwa.malay.ageLimit;
        pwa.malay.ageRating = ageRating || pwa.malay.ageRating;
        pwa.malay.install = install || pwa.malay.install;
        pwa.malay.wishlist = wishlist || pwa.malay.wishlist;
        pwa.malay.available = available || pwa.malay.available;
        pwa.malay.aboutThisGame = aboutThisGame || pwa.malay.aboutThisGame;
        pwa.malay.about1 = about1 || pwa.malay.about1;
        pwa.malay.about2 = about2 || pwa.malay.about2;
        pwa.malay.about3 = about3 || pwa.malay.about3;
        pwa.malay.updatedOn = updatedOn || pwa.malay.updatedOn;
        pwa.malay.updatedDate = updatedDate || pwa.malay.updatedDate;
        pwa.malay.casino = casino || pwa.malay.casino;
        pwa.malay.dataSafety = dataSafety || pwa.malay.dataSafety;
        pwa.malay.safety = safety || pwa.malay.safety;
        pwa.malay.noInformation = noInformation || pwa.malay.noInformation;
        pwa.malay.seeDetails = seeDetails || pwa.malay.seeDetails;
        pwa.malay.ratingsAndReviews =
          ratingsAndReviews || pwa.malay.ratingsAndReviews;
        pwa.malay.verified = verified || pwa.malay.verified;
        pwa.malay.phone = phone || pwa.malay.phone;
        pwa.malay.tV = tV || pwa.malay.tV;
        pwa.malay.chromebook = chromebook || pwa.malay.chromebook;
        pwa.malay.tablet = tablet || pwa.malay.tablet;
        pwa.malay.reviews = reviews || pwa.malay.reviews;
        pwa.malay.fourPointThree = fourPointThree || pwa.malay.fourPointThree;
        pwa.malay.fifteenM = fifteenM || pwa.malay.fifteenM;
        pwa.malay.review1 = review1 || pwa.malay.review1;
        pwa.malay.review2 = review2 || pwa.malay.review2;
        pwa.malay.review3 = review3 || pwa.malay.review3;
        pwa.malay.review4 = review4 || pwa.malay.review4;
        pwa.malay.allReviews = allReviews || pwa.malay.allReviews;
        pwa.malay.whatsNew = whatsNew || pwa.malay.whatsNew;
        pwa.malay.findHelpful = findHelpful || pwa.malay.findHelpful;
        pwa.malay.yes = yes || pwa.malay.yes;
        pwa.malay.no = no || pwa.malay.no;
        pwa.malay.contact = contact || pwa.malay.contact;
        pwa.malay.icon = icon || pwa.malay.icon;
        pwa.malay.screenShots = screenShots || pwa.malay.screenShots;
        pwa.malay.fallBackScreenShots =
          fallBackScreenShots || pwa.malay.fallBackScreenShots;
        pwa.malay.backgroundPhotoMobile =
          backgroundPhotoMobile || pwa.malay.backgroundPhotoMobile;
        pwa.malay.backgroundPhotoDesktop =
          backgroundPhotoDesktop || pwa.malay.backgroundPhotoDesktop;
        pwa.malay.fallBackBackgroundPhotoMobile =
          fallBackBackgroundPhotoMobile ||
          pwa.malay.fallBackBackgroundPhotoMobile;
        pwa.malay.fallBackBackgroundPhotoDesktop =
          fallBackBackgroundPhotoDesktop ||
          pwa.malay.fallBackBackgroundPhotoDesktop;
        pwa.malay.logo = logo || pwa.malay.logo;
        pwa.malay.appTitle = appTitle || pwa.malay.appTitle;
        pwa.malay.appSubTitle = appSubTitle || pwa.malay.appSubTitle;
        updatedPWA = await pwa.save();
      }

      if (updatedPWA) {
        res.status(200).json(updatedPWA);
      } else {
        res.status(404);
        throw new Error("App not found");
      }
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

module.exports = {
  createPwa,
  getAllPwa,
  getPwaByIdAndLanguage,
  getPwaById,
  updatePwa,
  deletePwa,
};
