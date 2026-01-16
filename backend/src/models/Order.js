const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    totalPoints: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "orders" }
);

module.exports = Order;
