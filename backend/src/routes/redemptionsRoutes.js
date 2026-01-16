const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/redemptionsController");

router.post("/", authenticate, controller.create);
router.get("/", authenticate, controller.list);

module.exports = router;
