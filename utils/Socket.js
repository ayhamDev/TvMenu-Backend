const { Server } = require("socket.io");
const { SocketLogin } = require("../Middleware/SocketLogin");
const { device, Command, Programs } = require("./db");
const fs = require("fs");
const moment = require("moment");
const UpdateLastOnline = require("./UpdateLastOnline");

const io = new Server(null, {
  cors: {
    origin: ["*"],
  },
  pingTimeout: 2000,
  pingInterval: 10000,
});
io.use(SocketLogin);
io.on("connection", async (socket) => {
  const { Device_ID, Device_Token, User_ID } = socket.handshake.auth;

  const SocketDevice = await device.findOne({
    where: { Device_ID, Device_Token, User_ID },
  });
  SocketDevice.connectionID = socket.id;
  SocketDevice.Last_Online_hit = Date.now();
  await SocketDevice.save();

  socket.on("disconnect", async () => {
    UpdateLastOnline(Device_ID, Device_Token);
    const SocketDevice = await device.findOne({
      where: { Device_ID, Device_Token },
    });
    if (!SocketDevice) return null;
    SocketDevice.connectionID = null;
    SocketDevice.Last_Online_hit = Date.now();
    await SocketDevice.save();
  });
  socket.on("device_command@executing", async (command) => {
    UpdateLastOnline(Device_ID, Device_Token);
    const FoundCommand = await Command.findOne({
      where: {
        ...command,
        Command_Status: "pending",
      },
    });
    if (FoundCommand) {
      FoundCommand.Command_Status = "executing";
      FoundCommand.ExecutedAt = Date.now();
      await FoundCommand.save();
    }
  });
  socket.on("device_command@fail", async (command) => {
    UpdateLastOnline(Device_ID, Device_Token);

    const FoundCommand = await Command.findOne({
      where: {
        ...command,
      },
    });
    if (FoundCommand) {
      FoundCommand.Command_Status = "fail";
      await FoundCommand.save();
    }
  });
  socket.on("device_command@success", async (command, data) => {
    UpdateLastOnline(Device_ID, Device_Token);

    const FoundCommand = await Command.findOne({
      where: {
        ...command,
        Command_Status: "executing",
      },
    });
    if (FoundCommand) {
      FoundCommand.Command_Status = "success";
      await FoundCommand.save();
    }
    if (data && command.Command_Type == "Screenshot") {
      const BufferData = Buffer.from(data, "base64");
      fs.writeFileSync(
        `${__dirname}\\..\\uploads\\${command.Device_ID}@${command.Device_Token}_ID${command.Command_ID}.jpg`,
        BufferData
      );
      io.to(socket.id).emit(
        "device_command@success_upload",
        `${__dirname}\\..\\uploads\\${command.Device_ID}@${command.Device_Token}_ID${command.Command_ID}.jpg`
      );
    }
  });

  const Commands = await Command.findAll({
    where: {
      Device_ID,
      Device_Token,
      User_ID: User_ID,
      Command_Status: ["pending", "executing"],
    },
  });
  const AllPrograms = await Programs.findAll({
    where: {
      Device_Token,
      User_ID: User_ID,
    },
  });
  const DevicePrograms = [];
  if (AllPrograms.length != 0) {
    AllPrograms.forEach((program) => {
      if (program.Device_ID.includes(Device_ID)) {
        DevicePrograms.push(program);
      }
    });
  }

  io.to(socket.id).emit("device_commands", Commands);
  io.to(socket.id).emit("device_programs", DevicePrograms);
  io.to(socket.id).emit("device_data", socket.data);
});

module.exports.io = io;
