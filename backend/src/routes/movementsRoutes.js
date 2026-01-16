const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/movementsController");

router.get("/", authenticate, controller.list);

module.exports = router;
