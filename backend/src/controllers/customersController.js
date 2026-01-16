const { listCustomers, getCustomer, createCustomer, findOrCreateCustomerByPhone, getCustomerByQr } = require("../services/customerService");
const { getCustomerBalance } = require("../services/pointsService");

exports.list = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const search = req.query.search || "";
    const customers = await listCustomers({ businessId, search });
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customer = await getCustomer({ businessId, id: Number(req.params.id) });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.balance = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customerId = Number(req.params.id);
    const balance = await getCustomerBalance({ businessId, customerId });
    res.json({ customerId, balance });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const { phone, name } = req.body;
    const customer = await createCustomer({ businessId, phone, name });
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

exports.findOrCreate = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const { phone, name } = req.body;
    const customer = await findOrCreateCustomerByPhone({ businessId, phone, name });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.byQr = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const { qrCodeValue } = req.body;
    if (!qrCodeValue) return res.status(400).json({ message: "qrCodeValue is required" });
    const customer = await getCustomerByQr({ businessId, qrCodeValue });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};
