const express = require("express");
const {
  createPwa,
  getAllPwa,
  getPwaByIdAndLanguage,
  getPwaById,
  updatePwa,
  updatePwaGeneral,
  updatePwaByCountryAndLanguage,
  deletePwa,
} = require("../controllers/pwaControllers");
const router = express.Router();
//user authentication
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", createPwa);
router.get("/", getAllPwa);
router.get("/:appId/:language/:country", getPwaByIdAndLanguage);
router.get("/:appId", getPwaById);
router.patch("/", updatePwa);
router.patch("/update-general", updatePwaGeneral);
router.patch("/update-by-country-and-language", updatePwaByCountryAndLanguage);
router.delete("/:appId", deletePwa);

module.exports = router;
