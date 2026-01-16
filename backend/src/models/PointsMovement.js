const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PointsMovement = sequelize.define(
  "PointsMovement",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(20), allowNull: false }, // EARN|REDEEM|ADJUST|QUICK_ADD
    points: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    referenceType: { type: DataTypes.STRING(40), allowNull: true },
    referenceId: { type: DataTypes.INTEGER, allowNull: true },
    note: { type: DataTypes.STRING(255), allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "points_movements" }
);

module.exports = PointsMovement;
