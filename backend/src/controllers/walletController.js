const { Customer } = require("../models");
const { generateAddToWalletLink, syncCustomerPass } = require("../services/walletService");

exports.addLink = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customerId = Number(req.params.customerId);
    const customer = await Customer.findOne({ where: { id: customerId, businessId } });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const result = await generateAddToWalletLink({ businessId, customerId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.syncCustomer = async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const customerId = Number(req.params.customerId);
    const customer = await Customer.findOne({ where: { id: customerId, businessId } });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const result = await syncCustomerPass({ businessId, customerId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
