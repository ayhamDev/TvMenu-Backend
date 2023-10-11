const { Socket } = require("socket.io");
const { device, UnRegisteredDevice, LogWriter } = require("../utils/db");
const moment = require("moment/moment");
const UpdateLastOnline = require("../utils/UpdateLastOnline");

const SocketLogin = async (
  socket = Socket,
  next = (error = Error) => undefined
) => {
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
    const LogWriterData = await LogWriter.findOne({
      where: {
        Device_ID: Device_ID,
        Device_Token: Device_Token,
        Log_Type: "NewDevice",
      },
    });
    if (RegisteredDevice) {
      RegisteredDevice.Last_Date_Time_Hit = Date.now();
      RegisteredDevice.IP_Address = socket.conn.remoteAddress;
      RegisteredDevice.Requested_Count++;
      await RegisteredDevice.save();
    } else {
      await UnRegisteredDevice.create({
        Unregistered_Device_ID: Device_ID,
        Device_Token,
        IP_Address: socket.conn.remoteAddress,
        First_Date_Time_Hit: Date.now(),
        Requested_Count: 1,
      });
    }
    if (LogWriterData) {
      LogWriterData.Ip_Address = socket.conn.remoteAddress;
      const logData = LogWriterData.Log_Data;
      logData.push({
        IP_Address: socket.conn.remoteAddress,
        timestamp: Date.now(),
        Date: moment(Date.now()).format("LLLL"),
      });
      LogWriterData.Log_Data = logData;
      await LogWriterData.save();
    } else {
      await LogWriter.create({
        Log_Type: "NewDevice",
        Ip_Address: socket.conn.remoteAddress,
        Device_ID: Device_ID,
        Device_Token: Device_Token,
        Log_Data: [
          {
            IP_Address: socket.conn.remoteAddress,
            timestamp: Date.now(),
            Date: moment(Date.now()).format("LLLL"),
          },
        ],
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
    const data = await Device.save();
    socket.data = data;
    UpdateLastOnline(Device_ID, Device_Token);
    next();
  }
};
module.exports.SocketLogin = SocketLogin;
