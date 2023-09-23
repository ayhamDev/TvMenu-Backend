require("dotenv").config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const PORT = process.env.PORT || 4444;
const cors = require("cors");
const { sql, device } = require("./utils/db");
const { query, body, validationResult } = require("express-validator");
const { Server } = require("socket.io");
const HttpServer = createServer(app);

const io = new Server(HttpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

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
app.use(express.json());
sql
  .authenticate()
  .then(async () => {
    console.log("connected To Database.");
  })
  .catch((err) => {
    console.log(err);
  });
io.use(async (socket, next) => {
  const { Device_ID, Token } = socket.handshake.auth;
  if (!Device_ID || !Token) return next(new Error("unauthorized"));
  const Device = await device.findOne({
    where: { Device_ID, Device_Token: Token },
  });
  if (!Device) return next(new Error("Device Not Found"));
  socket.data = Device;
  next();
});
io.on("connection", async (socket) => {
  io.to(socket.id).emit("device_data", socket.data);
});
app.get("/ping", (req, res) => {
  res.send("ping");
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
    try {
      const Device = await device.findOne({
        where: { Device_ID, Device_Token },
      });
      if (!Device)
        return res.status(400).json({
          message:
            "Device Not Found, The Device uuid is Invaild or The Token is Invaild",
        });
      res.json(Device);
      // Update Last_Online_hit For The Next Request
      await device.update(
        {
          Last_Online_hit: Date.now(),
        },
        { where: { Device_ID, Device_Token } }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// Is Admin Middlerware
app.use((req, res, next) => {
  const { api_key } = req.headers;
  // invalid api key > 401 no access
  if ((process.env.API_KEY || "myapikey") != api_key)
    return res.status(401).json({
      message: "invalid Api key",
    });
  // valid api key > Next
  next();
});
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
      await device.destroy({
        where: {
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        },
      });
      res.json({
        message: "Device deleted successfully",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
      });
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

app.put(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("Device_Token").isString().notEmpty(),
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
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        },
      });
      if (!FoundDevice)
        return res.status(400).json({
          message:
            "Device Not Found, The Device uuid is Invaild or The Token is Invaild",
        });
      const DeviceNext = await device.findOne({
        where: {
          Device_ID: req.body.Device_ID,
          Device_Token: req.body.Device_Token,
        },
      });

      if (
        DeviceNext &&
        (req.body.Device_ID != req.query.Device_ID ||
          req.body.Device_Token != req.query.Device_Token)
      )
        return res.status(400).json({
          message: "Device With The Same uuid And token already exists",
        });
      FoundDevice.Device_ID = req.body.Device_ID;
      FoundDevice.Device_Token = req.body.Device_Token;
      FoundDevice.Display_Type = req.body.Display_Type;
      FoundDevice.Web_Url = req.body.Web_Url;
      FoundDevice.Image_URL = req.body.Image_URL;
      FoundDevice.Offline_Image = req.body.Offline_Image;
      FoundDevice.Mp4_URL = req.body.Mp4_URL;
      try {
        const data = await FoundDevice.save();

        io.emit(
          `update://${req.query.Device_ID}@${req.query.Device_Token}`,
          data.dataValues
        );
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
      return res.status(500).json(err);
    }
  }
);

// Start the server
HttpServer.listen(PORT, () => {
  console.log("Server Is Running");
});
