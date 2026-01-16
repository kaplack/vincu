const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/ordersController");

router.post("/", authenticate, controller.create);
router.get("/", authenticate, controller.list);
router.post("/quick-add", authenticate, controller.quickAdd);

module.exports = router;
