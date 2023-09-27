const { validationResult } = require("express-validator");
const { Command, device } = require("../utils/db");
const { io } = require("../utils/Socket");

const GetCommands = async (req, res) => {
  if (req.query) {
    const commands = await Command.findAll({
      where: {
        ...req.query,
      },
    });
    res.json(commands);
  } else {
    const commands = await Command.findAll();
    res.json(commands);
  }
};
const CreateCommand = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { Device_ID, Device_Token, Command_Type } = req.body;
  const FoundDevice = await device.findOne({
    where: {
      Device_ID,
      Device_Token,
    },
  });
  if (!FoundDevice)
    return res.status(404).json({
      msg: "Device Not Found, Please Check The Device ID and Device Token.",
    });
  try {
    const command = await Command.create({
      Device_ID,
      Device_Token,
      Command_Type,
      CreatedAt: Date.now(),
    });
    io.sockets.sockets
      .get(FoundDevice.connectionID)
      ?.emit("device_commands", command);
    res.json({
      message: "The Command Was Created Successfully.",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed To Create Command For The Device",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
      error: err,
    });
  }
};
const DeleteCommand = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const command = await Command.destroy({
      where: {
        Command_ID: req.query.Command_ID,
      },
    });
    if (command == 0)
      return res.json({
        message: "The Command Doesn't Exist.",
        Command_ID: req.query.Command_ID,
      });
    res.json({
      message: "The Command Was Deleted Successfully.",
      Device_ID: command.Device_ID,
      Device_Token: command.Device_Token,
      Command_ID: command.Command_ID,
    });
  } catch (err) {
    res.json({
      message: "Couldn't Delete Command.",
      Command_ID: req.query.Command_ID,
    });
  }
};

module.exports = { GetCommands, CreateCommand, DeleteCommand };
