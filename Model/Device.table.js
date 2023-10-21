const { DataTypes } = require("sequelize");

const DeviceTable = (sql) =>
  sql.define("Device", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    connectionID: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    Offline_Image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM(["Active", "Suspended"]),
      validate: {
        isIn: {
          args: [["Active", "Suspended"]],
          msg: "Invalid Device Status.",
        },
      },
      allowNull: false,
      defaultValue: "Active",
    },
    Status_Message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Last_Online_hit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

module.exports = DeviceTable;
