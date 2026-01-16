const { Op, fn, col } = require("sequelize");
const { PointsMovement } = require("../models");
const { toNumber } = require("../utils/number");

/**
 * Returns the current points balance for a customer.
 */
async function getCustomerBalance({ businessId, customerId }) {
  const row = await PointsMovement.findOne({
    where: { businessId, customerId },
    attributes: [[fn("COALESCE", fn("SUM", col("points")), 0), "balance"]],
    raw: true,
  });
  return toNumber(row?.balance);
}

module.exports = { getCustomerBalance };
