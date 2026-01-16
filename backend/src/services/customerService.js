const { Op } = require("sequelize");
const { Customer } = require("../models");
const { buildCustomerQrValue } = require("../utils/qr");

/**
 * List customers for a business.
 */
async function listCustomers({ businessId, search = "" }) {
  const q = String(search || "").trim();
  const where = { businessId };
  if (q) {
    where[Op.or] = [
      { phone: { [Op.iLike]: `%${q}%` } },
      { name: { [Op.iLike]: `%${q}%` } },
    ];
  }
  return Customer.findAll({ where, order: [["createdAt", "DESC"]], limit: 200 });
}

async function getCustomer({ businessId, id }) {
  return Customer.findOne({ where: { id, businessId } });
}

async function createCustomer({ businessId, phone, name = null }) {
  const cleanPhone = String(phone || "").replace(/\s+/g, "").trim();
  if (!cleanPhone) {
    const err = new Error("phone is required");
    err.status = 400;
    throw err;
  }
  const qrCodeValue = buildCustomerQrValue({ businessId, phone: cleanPhone });
  return Customer.create({ businessId, phone: cleanPhone, name, qrCodeValue });
}

async function findOrCreateCustomerByPhone({ businessId, phone, name = null }) {
  const cleanPhone = String(phone || "").replace(/\s+/g, "").trim();
  if (!cleanPhone) {
    const err = new Error("phone is required");
    err.status = 400;
    throw err;
  }

  const existing = await Customer.findOne({ where: { businessId, phone: cleanPhone } });
  if (existing) return existing;
  return createCustomer({ businessId, phone: cleanPhone, name });
}

async function getCustomerByQr({ businessId, qrCodeValue }) {
  return Customer.findOne({ where: { businessId, qrCodeValue } });
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  findOrCreateCustomerByPhone,
  getCustomerByQr,
};
