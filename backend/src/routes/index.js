const router = require("express").Router();
router.use("/auth", require("./authRoutes"));

// Business context
router.use("/business", require("./businessRoutes"));
router.use("/customers", require("./customersRoutes"));
router.use("/products", require("./productsRoutes"));
router.use("/rewards", require("./rewardsRoutes"));
router.use("/orders", require("./ordersRoutes"));
router.use("/redemptions", require("./redemptionsRoutes"));
router.use("/movements", require("./movementsRoutes"));
router.use("/reports", require("./reportsRoutes"));
router.use("/wallet", require("./walletRoutes"));

router.get("/", (req, res) => {
  res.json({ name: "VINCU API", version: "v1" });
});

module.exports = router;
