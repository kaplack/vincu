const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/walletController");

router.get("/add-link/:customerId", authenticate, controller.addLink);
router.post("/sync-customer/:customerId", authenticate, controller.syncCustomer);

module.exports = router;
