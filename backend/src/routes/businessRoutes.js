const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const businessController = require("../controllers/businessController");

router.get("/me", authenticate, businessController.getMe);
router.put("/me", authenticate, businessController.updateMe);

module.exports = router;
