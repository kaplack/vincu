const { sequelize, Product, Order, OrderItem, PointsMovement } = require("../models");
const { toNumber } = require("../utils/number");
const { findOrCreateCustomerByPhone, getCustomer } = require("./customerService");
const { getCustomerBalance } = require("./pointsService");

/**
 * Creates an order and awards points based on products.
 * @param {{businessId:number,userId:number,customerId?:number,phone?:string,items:Array<{productId:number,qty:number|string}>}} payload
 */
async function createOrder(payload) {
  const { businessId, userId, customerId, phone, items } = payload;
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("items are required");
    err.status = 400;
    throw err;
  }

  return sequelize.transaction(async (t) => {
    let customer = null;
    if (customerId) {
      customer = await getCustomer({ businessId, id: customerId });
    } else if (phone) {
      customer = await findOrCreateCustomerByPhone({ businessId, phone });
    }
    if (!customer) {
      const err = new Error("Customer not found");
      err.status = 404;
      throw err;
    }

    // Load products
    const productIds = items.map((i) => i.productId);
    const products = await Product.findAll({ where: { businessId, id: productIds, isActive: true }, transaction: t });
    const byId = new Map(products.map((p) => [p.id, p]));

    let totalPoints = 0;
    const normalizedItems = items.map((i) => {
      const p = byId.get(i.productId);
      if (!p) {
        const err = new Error(`Product not found or inactive: ${i.productId}`);
        err.status = 400;
        throw err;
      }
      const qty = toNumber(i.qty) || 1;
      const pointsEarned = toNumber(p.pointsPerUnit) * qty;
      totalPoints += pointsEarned;
      return { productId: p.id, qty, pointsEarned };
    });

    const order = await Order.create(
      { businessId, customerId: customer.id, totalPoints: totalPoints.toFixed(2), createdBy: userId },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      normalizedItems.map((it) => ({ ...it, orderId: order.id })),
      { transaction: t }
    );

    await PointsMovement.create(
      {
        businessId,
        customerId: customer.id,
        type: "EARN",
        points: totalPoints.toFixed(2),
        referenceType: "ORDER",
        referenceId: order.id,
        createdBy: userId,
      },
      { transaction: t }
    );

    const balance = await getCustomerBalance({ businessId, customerId: customer.id });

    return { orderId: order.id, totalPoints: Number(totalPoints.toFixed(2)), customer, balance };
  });
}

/**
 * One-tap +1 point without creating an order.
 */
async function quickAddPoint({ businessId, userId, customerId }) {
  if (!customerId) {
    const err = new Error("customerId is required");
    err.status = 400;
    throw err;
  }

  return sequelize.transaction(async (t) => {
    const customer = await getCustomer({ businessId, id: customerId });
    if (!customer) {
      const err = new Error("Customer not found");
      err.status = 404;
      throw err;
    }

    await PointsMovement.create(
      {
        businessId,
        customerId,
        type: "QUICK_ADD",
        points: 1,
        referenceType: "QUICK_ADD",
        referenceId: null,
        note: "+1 quick add",
        createdBy: userId,
      },
      { transaction: t }
    );

    const balance = await getCustomerBalance({ businessId, customerId });
    return { customer, balance };
  });
}

module.exports = { createOrder, quickAddPoint };
