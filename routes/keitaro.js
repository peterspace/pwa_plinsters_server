const express = require("express");
const {
  getAllCampaigns,
  getUsersLocation,
} = require("../controllers/keitaroControllers");
const router = express.Router();

router.get("/", getAllCampaigns);
router.post("/location", getUsersLocation);

module.exports = router;
