const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Redemption = sequelize.define(
  "Redemption",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    rewardId: { type: DataTypes.INTEGER, allowNull: false },
    pointsSpent: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "CONFIRMED" },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "redemptions" }
);

module.exports = Redemption;
