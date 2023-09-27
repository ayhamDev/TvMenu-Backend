const { DataTypes } = require("sequelize");

const DeviceTable = (sql) =>
  sql.define("device", {
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
    Display_Type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Web_Url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Image_URL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Mp4_URL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Offline_Image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Last_Online_hit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

module.exports = DeviceTable;
