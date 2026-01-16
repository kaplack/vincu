const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/customersController");

router.get("/", authenticate, controller.list);
router.get("/:id", authenticate, controller.get);
router.get("/:id/balance", authenticate, controller.balance);
router.post("/", authenticate, controller.create);
router.post("/find-or-create", authenticate, controller.findOrCreate);
router.post("/by-qr", authenticate, controller.byQr);

module.exports = router;
