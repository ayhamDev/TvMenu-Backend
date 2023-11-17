const { DataTypes } = require("sequelize");

const DeviceTable = (sql) =>
  sql.define("Device", {
    Device_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    User_ID: {
      type: DataTypes.UUID,
      allowNull: false,
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
      primaryKey: true,
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
