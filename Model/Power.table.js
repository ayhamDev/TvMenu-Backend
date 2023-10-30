const { DataTypes } = require("sequelize");

const DevicePowerTable = (sql) =>
  sql.define("Device_Power", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    User_ID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    Sat_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Sat_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Sun_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Sun_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Mon_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Mon_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Tue_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Tue_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Wed_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Wed_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Thu_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Thu_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Fri_On: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Fri_Off: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Command_Txt1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Command_Txt2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Command_On: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Command_Off: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

module.exports = DevicePowerTable;
