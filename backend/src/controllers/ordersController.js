const { Order, OrderItem, Product, Customer } = require("../models");
const { createOrder, quickAddPoint } = require("../services/orderService");
const { getCustomerByQr, getCustomer } = require("../services/customerService");

exports.create = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const userId = req.user.userId;
    const { customerId, phone, items } = req.body;
    const result = await createOrder({ businessId, userId, customerId, phone, items });
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

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 200,
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: Customer },
      ],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.quickAdd = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const userId = req.user.userId;
    const { customerId, qrCodeValue } = req.body;
    let resolvedCustomerId = customerId ? Number(customerId) : null;
    if (!resolvedCustomerId && qrCodeValue) {
      const c = await getCustomerByQr({ businessId, qrCodeValue });
      if (!c) return res.status(404).json({ message: "Customer not found" });
      resolvedCustomerId = c.id;
    }
    const result = await quickAddPoint({ businessId, userId, customerId: resolvedCustomerId });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
