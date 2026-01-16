const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/rewardsController");

router.get("/", authenticate, controller.list);
router.post("/", authenticate, controller.create);
router.put("/:id", authenticate, controller.update);

module.exports = router;
