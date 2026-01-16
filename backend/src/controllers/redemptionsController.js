const { Redemption, Reward, Customer } = require("../models");
const { createRedemption } = require("../services/redemptionService");

exports.create = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const userId = req.user.userId;
    const { customerId, phone, rewardId } = req.body;
    const result = await createRedemption({ businessId, userId, customerId, phone, rewardId });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customerId = req.query.customerId ? Number(req.query.customerId) : null;
    const where = { businessId };
    if (customerId) where.customerId = customerId;
    const items = await Redemption.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 200,
      include: [{ model: Reward }, { model: Customer }],
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};
