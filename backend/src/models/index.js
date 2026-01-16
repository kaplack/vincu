const sequelize = require("../config/db");

const Business = require("./Business");
const User = require("./User");
const Customer = require("./Customer");
const Product = require("./Product");
const Reward = require("./Reward");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const PointsMovement = require("./PointsMovement");
const Redemption = require("./Redemption");

// Associations
Business.hasMany(User, { foreignKey: "businessId" });
User.belongsTo(Business, { foreignKey: "businessId" });

Business.hasMany(Customer, { foreignKey: "businessId" });
Customer.belongsTo(Business, { foreignKey: "businessId" });

Business.hasMany(Product, { foreignKey: "businessId" });
Product.belongsTo(Business, { foreignKey: "businessId" });

Business.hasMany(Reward, { foreignKey: "businessId" });
Reward.belongsTo(Business, { foreignKey: "businessId" });

Business.hasMany(Order, { foreignKey: "businessId" });
Order.belongsTo(Business, { foreignKey: "businessId" });
Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });
User.hasMany(Order, { foreignKey: "createdBy" });
Order.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Customer.hasMany(PointsMovement, { foreignKey: "customerId" });
PointsMovement.belongsTo(Customer, { foreignKey: "customerId" });
Business.hasMany(PointsMovement, { foreignKey: "businessId" });
PointsMovement.belongsTo(Business, { foreignKey: "businessId" });
User.hasMany(PointsMovement, { foreignKey: "createdBy" });
PointsMovement.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Business.hasMany(Redemption, { foreignKey: "businessId" });
Redemption.belongsTo(Business, { foreignKey: "businessId" });
Customer.hasMany(Redemption, { foreignKey: "customerId" });
Redemption.belongsTo(Customer, { foreignKey: "customerId" });
Reward.hasMany(Redemption, { foreignKey: "rewardId" });
Redemption.belongsTo(Reward, { foreignKey: "rewardId" });
User.hasMany(Redemption, { foreignKey: "createdBy" });
Redemption.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

module.exports = {
  sequelize,
  Business,
  User,
  Customer,
  Product,
  Reward,
  Order,
  OrderItem,
  PointsMovement,
  Redemption,
};
