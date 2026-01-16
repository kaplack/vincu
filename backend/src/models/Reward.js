const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reward = sequelize.define(
  "Reward",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    costPoints: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "rewards" }
);

module.exports = Reward;
