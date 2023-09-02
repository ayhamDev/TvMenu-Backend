const { Sequelize, DataTypes } = require("sequelize");

const sql = new Sequelize({
  // SQLite Config
  dialect: "sqlite",
  database: "./db/mydb.db",

  //  Microsoft SQL Server Config
  // host: "<YOUR_HOST>",
  // database: 'tvmenu',
  // username: "<user_name>",
  // password: "<user_password>",

  define: {
    timestamps: true,
  },
});

const Device = sql.define("device", {
  id: {
    type: Sequelize.INTEGER,
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
  Display_Type: {
    type: DataTypes.NUMBER,
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

(module.exports.sql = sql), (module.exports.device = Device);
