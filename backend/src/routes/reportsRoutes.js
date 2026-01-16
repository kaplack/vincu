const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/reportsController");

router.get("/summary", authenticate, controller.summary);
router.get("/top-customers", authenticate, controller.topCustomers);
router.get("/rewards-usage", authenticate, controller.rewardsUsage);

module.exports = router;
