const { Sequelize, DataTypes, Model } = require("sequelize");

// Dev env (sqlite)
// SQLite Config
const sql = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  define: {
    timestamps: false,
  },
});

//   //  Microsoft SQL Server Config
// const sql = new Sequelize("TVmenu","TVBackendUser","Hello!@!@!@2023A",{
//   host: "localhost",
//   dialect: "mssql",
//   port: '1433',
//   pool: {
//     min:0,
//     max: 10,
//     idle:25000,
//     acquire: 25000,
//     requestTimeout: 30000
//   },
//    dialectOptions: {
//     options: {
//       "encrypt": false
//     }
//   },
const UnRegisteredDevice = sql.define("unregistered_device", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Unregistered_Device_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Device_Token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IP_Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  First_Date_Time_Hit: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Last_Date_Time_Hit: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Requested_Count: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 1,
  },
  Log_History: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Device = sql.define("device", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  connectionID: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
    onUpdate(...args) {
      console.log(args);
    },
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

(module.exports.sql = sql),
  (module.exports.device = Device),
  (module.exports.UnRegisteredDevice = UnRegisteredDevice);
