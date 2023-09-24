require("dotenv").config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const PORT = process.env.PORT || 4444;
const cors = require("cors");
const { sql, device, UnRegisteredDevice } = require("./utils/db");
const { query, body, validationResult } = require("express-validator");
const requestIp = require("request-ip");
const moment = require("moment/moment");
const { Server } = require("socket.io");
const HttpServer = createServer(app);

app.use(cors());
app.use(requestIp.mw());

// db Migrations
// sql
//   .sync()
//   .then(() => {
//     console.log("synced");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// db production
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
sql
  .authenticate()
  .then(async () => {
    console.log("connected To Database.");
  })
  .catch((err) => {
    console.log(err);
  });
const io = new Server(HttpServer, {
  cors: {
    origin: ["*"],
  },
});
io.use(async (socket, next) => {
  const { Device_ID, Device_Token } = socket.handshake.auth;
  if (!Device_ID || !Device_Token) return next(new Error("unauthorized"));
  const Device = await device.findOne({
    where: { Device_ID, Device_Token },
  });

  if (!Device) {
    const RegisteredDevice = await UnRegisteredDevice.findOne({
      where: {
        Unregistered_Device_ID: Device_ID,
        Device_Token: Device_Token,
      },
    });
    if (RegisteredDevice) {
      RegisteredDevice.Requested_Count = RegisteredDevice.Requested_Count + 1;
      RegisteredDevice.Last_Date_Time_Hit = Date.now();
      RegisteredDevice.IP_Address = socket.conn.remoteAddress;
      let Logs = JSON.parse(RegisteredDevice.Log_History);
      Logs.push({
        IP_Address: socket.conn.remoteAddress,
        time: Date.now(),
        Date: moment(Date.now()).format("LLLL"),
      });
      RegisteredDevice.Log_History = JSON.stringify(Logs);
      await RegisteredDevice.save();
    } else {
      await UnRegisteredDevice.create({
        Unregistered_Device_ID: Device_ID,
        Device_Token,
        IP_Address: socket.conn.remoteAddress,
        First_Date_Time_Hit: Date.now(),
        Requested_Count: 1,
        Log_History: JSON.stringify([
          {
            IP_Address: socket.conn.remoteAddress,
            timestamp: Date.now(),
            Date: moment(Date.now()).format("LLLL"),
          },
        ]),
      });
    }
    next(new Error("Device Not Found"));
  } else {
    if (Device.Status != "Active")
      return next(
        new Error(
          Device.dataValues.Status_Message || "This Device Is Not Active."
        )
      );
    socket.data = Device;

    next();
  }
});
io.on("connection", async (socket) => {
  const { Device_ID, Device_Token } = socket.handshake.auth;

  const SocketDevice = await device.findOne({
    where: { Device_ID, Device_Token },
  });
  SocketDevice.connectionID = socket.id;
  await SocketDevice.save();
  socket.on("disconnect", async () => {
    const SocketDevice = await device.findOne({
      where: { Device_ID, Device_Token },
    });
    if (!SocketDevice) return null;
    SocketDevice.connectionID = null;
    await SocketDevice.save();
  });

  io.to(socket.id).emit("device_data", socket.data);
});
app.get("/ping", (req, res) => {
  res.send("pong");
});
// Is Admin Middlerware
app.use((req, res, next) => {
  const { api_key } = req.headers;
  if (!api_key)
    return res.status(401).json({ message: "Api Key Is Required." });
  // invalid api key > 401 no access
  if ((process.env.API_KEY || "myapikey") != api_key)
    return res.status(401).json({
      message: "invalid Api Key.",
    });
  // valid api key > Next
  next();
});
app.get("/unregistered", async (req, res) => {
  const Devices = await UnRegisteredDevice.findAll();
  for (let index = 0; index < Devices.length; index++) {
    Devices[index].Log_History = JSON.parse(Devices[index].Log_History);
  }
  res.json(Devices);
});

app.get(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("Device_Token").isString().notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        message:
          "Device Not Found, The Device uuid is Invaild or The Token is Invaild",
      });
    const { Device_ID, Device_Token } = req.query;
    const Device = await device.findOne({
      where: { Device_ID, Device_Token },
    });
    if (!Device) {
      const RegisteredDevice = await UnRegisteredDevice.findOne({
        where: {
          Unregistered_Device_ID: Device_ID,
          Device_Token: Device_Token,
        },
      });
      if (!RegisteredDevice) {
        const Device = await UnRegisteredDevice.create({
          Unregistered_Device_ID: Device_ID,
          Device_Token,
          IP_Address: req.clientIp,
          First_Date_Time_Hit: Date.now(),
          Requested_Count: 1,
          Log_History: JSON.stringify([
            {
              IP_Address: req.clientIp,
              timestamp: Date.now(),
              Date: moment(Date.now()).format("LLLL"),
            },
          ]),
        });
        res.json({
          msg: "This Device Has Been Requested To Be Registered.",
          status: 101,
        });
      } else {
        RegisteredDevice.Requested_Count = RegisteredDevice.Requested_Count + 1;
        RegisteredDevice.Last_Date_Time_Hit = Date.now();
        RegisteredDevice.IP_Address = req.clientIp;
        let Logs = JSON.parse(RegisteredDevice.Log_History);
        Logs.push({
          IP_Address: req.clientIp,
          time: Date.now(),
          Date: moment(Date.now()).format("LLLL"),
        });
        RegisteredDevice.Log_History = JSON.stringify(Logs);
        await RegisteredDevice.save();
        res.json({
          msg: "This Device Has Been Requested To Be Registered.",
          status: 101,
        });
      }
    } else {
      // Update Last_Online_hit For The Next Request
      await device.update(
        {
          Last_Online_hit: Date.now(),
        },
        { where: { Device_ID, Device_Token } }
      );
      res.json(Device);
    }
  }
);
app.post(
  "/",
  body("Device_ID").isString().notEmpty(),
  body("Device_Token").isString().notEmpty(),
  body("Display_Type").isNumeric().notEmpty(),
  body("Web_Url").isString().notEmpty(),
  body("Image_URL").isString().notEmpty(),
  body("Mp4_URL").isString().notEmpty(),
  body("Offline_Image").isString().notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json(result.array());
    try {
      const FoundDevice = await device.findOne({
        where: {
          Device_ID: req.body.Device_ID,
          Device_Token: req.body.Device_Token,
        },
      });
      if (FoundDevice)
        return res.status(409).json({
          message: "the device already exists",
        });

      const CreatedDevice = await device.create({
        Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
        Display_Type: req.body.Display_Type,
        Web_Url: req.body.Web_Url,
        Image_URL: req.body.Image_URL,
        Mp4_URL: req.body.Mp4_URL,
        Offline_Image: req.body.Offline_Image,
      });
      await UnRegisteredDevice.destroy({
        where: {
          Unregistered_Device_ID: req.body.Device_ID,
          Device_Token: req.body.Device_Token,
        },
      });
      res.json(CreatedDevice);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
app.delete(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("Device_Token").isString().notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json(result.array());
    try {
      const SocketDevice = await device.findOne({
        where: {
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        },
      });
      if (!SocketDevice)
        return res.json({
          message: "Device Doesn't Exists",
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        });
      try {
        await device.destroy({
          where: {
            Device_ID: req.query.Device_ID,
            Device_Token: req.query.Device_Token,
          },
        });
        io.sockets.sockets.get(SocketDevice.connectionID)?.disconnect();
      } catch (err) {
        console.log(err);
      } finally {
        res.json({
          message: "Device deleted successfully",
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Failed to delete Device",
        Device_ID: req.query.Device_ID,
        device_Token: req.query.Device_Token,
        error: err,
      });
    }
  }
);

app.patch(
  "/",
  query("Device_ID").isString().optional(),
  query("Device_Token").isString().optional(),
  body("Device_ID").isString().optional(),
  body("Device_Token").isString().optional(),
  body("Display_Type").isNumeric().optional(),
  body("Web_Url").isString().optional(),
  body("Image_URL").isString().optional(),
  body("Mp4_URL").isString().optional(),
  body("Offline_Image").isString().optional(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json(result.array());
    try {
      const FoundDevice = await device.findOne({
        where: {
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        },
      });
      if (!FoundDevice)
        return res.status(400).json({
          message:
            "Device Not Found, The Device uuid is Invaild or The Token is Invaild",
        });

      try {
        for (const key in req.body) {
          if (Object.hasOwnProperty.call(req.body, key)) {
            FoundDevice[key] = req.body[key];
          }
        }
        await FoundDevice.save();
        if (FoundDevice.Status != "Active") {
          io.sockets.sockets.get(FoundDevice.connectionID)?.disconnect();
        }
        return res.json({
          message: "Device updated successfully",
          Device_ID: req.query.Device_ID,
          device_Token: req.query.Device_Token,
        });
      } catch (err) {
        return res.json({
          message: "Failed To Updated Device",
          Device_ID: req.query.Device_ID,
          device_Token: req.query.Device_Token,
          error: err,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed To Updated Device",
        Device_ID: req.query.Device_ID,
        device_Token: req.query.Device_Token,
      });
    }
  }
);

// Start the server
HttpServer.listen(PORT, () => {
  console.log("Server Is Running");
});
