const { Product } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const items = await Product.findAll({ where: { businessId }, order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const { name, pointsPerUnit, isActive } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const product = await Product.create({
      businessId,
      name: String(name).trim(),
      pointsPerUnit: pointsPerUnit ?? 1,
      isActive: isActive ?? true,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const id = Number(req.params.id);
    const product = await Product.findOne({ where: { id, businessId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, pointsPerUnit, isActive } = req.body;
    if (name !== undefined) product.name = String(name).trim();
    if (pointsPerUnit !== undefined) product.pointsPerUnit = pointsPerUnit;
    if (isActive !== undefined) product.isActive = !!isActive;

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};
