const { Reward } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const items = await Reward.findAll({ where: { businessId }, order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const { name, costPoints, isActive } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    if (costPoints === undefined || costPoints === null) return res.status(400).json({ message: "costPoints is required" });

    const reward = await Reward.create({ businessId, name: String(name).trim(), costPoints, isActive: isActive ?? true });
    res.status(201).json(reward);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const id = Number(req.params.id);
    const reward = await Reward.findOne({ where: { id, businessId } });
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    const { name, costPoints, isActive } = req.body;
    if (name !== undefined) reward.name = String(name).trim();
    if (costPoints !== undefined) reward.costPoints = costPoints;
    if (isActive !== undefined) reward.isActive = !!isActive;

    await reward.save();
    res.json(reward);
  } catch (err) {
    next(err);
  }
};
