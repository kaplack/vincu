const { PointsMovement, User } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customerId = req.query.customerId ? Number(req.query.customerId) : null;
    const where = { businessId };
    if (customerId) where.customerId = customerId;

    const items = await PointsMovement.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 500,
      include: [{ model: User, as: "creator", attributes: ["id", "fullName", "email"] }],
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
};
