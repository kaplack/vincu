const { fn, col, literal } = require("sequelize");
const { Customer, PointsMovement, Order, Redemption, Reward } = require("../models");
const { toNumber } = require("../utils/number");

exports.summary = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const [customersCount, ordersCount, redemptionsCount] = await Promise.all([
      Customer.count({ where: { businessId } }),
      Order.count({ where: { businessId } }),
      Redemption.count({ where: { businessId } }),
    ]);

    const earnedRow = await PointsMovement.findOne({
      where: { businessId, points: { [require("sequelize").Op.gt]: 0 } },
      attributes: [[fn("COALESCE", fn("SUM", col("points")), 0), "earned"]],
      raw: true,
    });
    const redeemedRow = await PointsMovement.findOne({
      where: { businessId, points: { [require("sequelize").Op.lt]: 0 } },
      attributes: [[fn("COALESCE", fn("SUM", col("points")), 0), "redeemed"]],
      raw: true,
    });

    res.json({
      customersCount,
      ordersCount,
      redemptionsCount,
      pointsEarned: toNumber(earnedRow?.earned),
      pointsRedeemed: Math.abs(toNumber(redeemedRow?.redeemed)),
    });
  } catch (err) {
    next(err);
  }
};

exports.topCustomers = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    // Aggregate balance per customer from ledger
    const rows = await PointsMovement.findAll({
      where: { businessId },
      attributes: ["customerId", [fn("SUM", col("points")), "balance"]],
      group: ["customerId"],
      order: [[literal("balance"), "DESC"]],
      limit: 10,
      raw: true,
    });

    const customerIds = rows.map((r) => r.customerId);
    const customers = await Customer.findAll({ where: { businessId, id: customerIds } });
    const byId = new Map(customers.map((c) => [c.id, c]));

    res.json(
      rows.map((r) => {
        const c = byId.get(r.customerId);
        return {
          customerId: r.customerId,
          phone: c?.phone || null,
          name: c?.name || null,
          balance: toNumber(r.balance),
        };
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.rewardsUsage = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const rows = await Redemption.findAll({
      where: { businessId },
      attributes: ["rewardId", [fn("COUNT", col("id")), "count"]],
      group: ["rewardId"],
      order: [[literal("count"), "DESC"]],
      limit: 20,
      raw: true,
    });
    const rewardIds = rows.map((r) => r.rewardId);
    const rewards = await Reward.findAll({ where: { businessId, id: rewardIds } });
    const byId = new Map(rewards.map((rw) => [rw.id, rw]));

    res.json(
      rows.map((r) => ({
        rewardId: r.rewardId,
        rewardName: byId.get(r.rewardId)?.name || null,
        count: Number(r.count),
      }))
    );
  } catch (err) {
    next(err);
  }
};
