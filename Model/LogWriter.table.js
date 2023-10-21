const { DataTypes } = require("sequelize");

const LogTable = (sql) =>
  sql.define("Log_Writer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Log_Type: {
      type: DataTypes.ENUM(["NewDevice"]),
      validate: {
        isIn: {
          args: [["NewDevice"]],
          msg: "Invalid Device Log Type.",
        },
      },
      allowNull: false,
      defaultValue: "NewDevice",
    },
    Ip_Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Log_Data: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue("Log_Data"));
      },
      set: function (value) {
        return this.setDataValue("Log_Data", JSON.stringify(value));
      },
    },
  });

module.exports = LogTable;
