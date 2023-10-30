require("dotenv").config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const PORT = process.env.PORT || 4444;
const cors = require("cors");
const { sql } = require("./utils/db");
const requestIp = require("request-ip");
const { CommandRouter } = require("./Routes/Command.route");
const { VerifyAPiKey } = require("./Middleware/VerifyApiKey");
const { UnRegisteredRouter } = require("./Routes/UnRegistered.route");
const { DeviceRouter } = require("./Routes/Device.route");
const { io } = require("./utils/Socket");
const { ProgramRouter } = require("./Routes/Programs.route");
const { LogWriterRouter } = require("./Routes/LogWriter.route");
const { PowerRouter } = require("./Routes/Power.route");
const { OfflineRouter } = require("./Routes/OfflineRouter.route");
const CreateDefaultAdmin = require("./utils/CreateDefaultAdmin");
const { UserRouter } = require("./Routes/User.route");
const HttpServer = createServer(app);

app.use(cors());
app.use(requestIp.mw());
io.attach(HttpServer);
// db Migrations
// sql
//   .sync({ force: true })
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
    CreateDefaultAdmin();
    // sql.drop();
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/ping", (req, res) => {
  res.send("pong");
});
// Is Admin Middlerware
app.use("/offline", OfflineRouter);
app.use("/user", UserRouter);

app.use(DeviceRouter);
app.use("/unregistered", UnRegisteredRouter);
app.use("/command", CommandRouter);
app.use("/program", ProgramRouter);
app.use("/log", LogWriterRouter);
app.use("/power", PowerRouter);
// Command

// Start the server
HttpServer.listen(PORT, () => {
  console.log("Server Is Running On Port:", PORT);
});
