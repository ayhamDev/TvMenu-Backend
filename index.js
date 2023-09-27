require("dotenv").config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const PORT = process.env.PORT || 4444;
const cors = require("cors");
const { sql, device, UnRegisteredDevice, Command } = require("./utils/db");
const { query, body, validationResult } = require("express-validator");
const requestIp = require("request-ip");
const moment = require("moment/moment");
const { Server } = require("socket.io");
const { CommandRouter } = require("./Routes/Command.route");
const { VerifyAPiKey } = require("./Middleware/VerifyApiKey");
const { SocketLogin } = require("./Middleware/SocketLogin");
const { UnRegisteredRouter } = require("./Routes/UnRegistered.route");
const { DeviceRouter } = require("./Routes/Device.route");
const { io } = require("./utils/Socket");
const HttpServer = createServer(app);

app.use(cors());
app.use(requestIp.mw());
io.attach(HttpServer);

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

app.get("/ping", (req, res) => {
  res.send("pong");
});
// Is Admin Middlerware
app.use(VerifyAPiKey);

app.use(DeviceRouter);
app.use("/unregistered", UnRegisteredRouter);

app.use("/command", CommandRouter);

// Command

// Start the server
HttpServer.listen(PORT, () => {
  console.log("Server Is Running On Port:", PORT);
});

module.exports.io = io;
