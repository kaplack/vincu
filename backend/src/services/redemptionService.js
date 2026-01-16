const { sequelize, Reward, Redemption, PointsMovement } = require("../models");
const { toNumber } = require("../utils/number");
const { getCustomerBalance } = require("./pointsService");
const { getCustomer, findOrCreateCustomerByPhone } = require("./customerService");

async function createRedemption({ businessId, userId, customerId, phone, rewardId }) {
  if (!rewardId) {
    const err = new Error("rewardId is required");
    err.status = 400;
    throw err;
  }

  return sequelize.transaction(async (t) => {
    let customer = null;
    if (customerId) customer = await getCustomer({ businessId, id: customerId });
    else if (phone) customer = await findOrCreateCustomerByPhone({ businessId, phone });
    if (!customer) {
      const err = new Error("Customer not found");
      err.status = 404;
      throw err;
    }

    const reward = await Reward.findOne({ where: { id: rewardId, businessId, isActive: true }, transaction: t });
    if (!reward) {
      const err = new Error("Reward not found or inactive");
      err.status = 404;
      throw err;
    }

    const cost = toNumber(reward.costPoints);
    const balance = await getCustomerBalance({ businessId, customerId: customer.id });
    if (balance < cost) {
      const err = new Error("Insufficient points");
      err.status = 400;
      err.details = { balance, cost };
      throw err;
    }

    const redemption = await Redemption.create(
      {
        businessId,
        customerId: customer.id,
        rewardId: reward.id,
        pointsSpent: cost.toFixed(2),
        status: "CONFIRMED",
        createdBy: userId,
      },
      { transaction: t }
    );

    await PointsMovement.create(
      {
        businessId,
        customerId: customer.id,
        type: "REDEEM",
        points: (-cost).toFixed(2),
        referenceType: "REDEMPTION",
        referenceId: redemption.id,
        createdBy: userId,
      },
      { transaction: t }
    );

    const newBalance = await getCustomerBalance({ businessId, customerId: customer.id });
    return { redemption, reward, customer, balance: newBalance };
  });
}

module.exports = { createRedemption };
