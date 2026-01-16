const { Business } = require("../models");

exports.getMe = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const business = await Business.findByPk(businessId);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const business = await Business.findByPk(businessId);
    if (!business) return res.status(404).json({ message: "Business not found" });
    const { name, status } = req.body;
    if (name !== undefined) business.name = String(name).trim();
    if (status !== undefined) business.status = String(status).trim();
    await business.save();
    res.json(business);
  } catch (err) {
    next(err);
  }
};
