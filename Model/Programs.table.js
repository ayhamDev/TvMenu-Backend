const { DataTypes } = require("sequelize");

const ProgramsTable = (sql) =>
  sql.define("Device_Programs", {
    Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Row_Number: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Program_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Layer_Number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Start_DateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    End_DateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Program_Type: {
      type: DataTypes.INTEGER,
      default: 1,
      allowNull: false,
    },
    Program_Web_Url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Image_Url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_MP4_Url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Status: {
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
    Program_Note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_X: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Y: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_W: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_H: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Program_Duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Next_Loop_Seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Program_Transition: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "fadeInUpBig",
    },
    Program_Transition_End: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "fadeOutDownBig",
    },
  });

module.exports = ProgramsTable;
