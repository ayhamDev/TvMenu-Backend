const { Socket } = require("socket.io");
const { device, UnRegisteredDevice } = require("../utils/db");
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
    if (RegisteredDevice) {
      RegisteredDevice.Requested_Count = RegisteredDevice.Requested_Count + 1;
      RegisteredDevice.Last_Date_Time_Hit = Date.now();
      RegisteredDevice.IP_Address = socket.conn.remoteAddress;
      // let Logs = JSON.parse(RegisteredDevice.Log_History);
      // Logs.push({
      //   IP_Address: socket.conn.remoteAddress,
      //   time: Date.now(),
      //   Date: moment(Date.now()).format("LLLL"),
      // });
      // RegisteredDevice.Log_History = JSON.stringify(Logs);
      await RegisteredDevice.save();
    } else {
      await UnRegisteredDevice.create({
        Unregistered_Device_ID: Device_ID,
        Device_Token,
        IP_Address: socket.conn.remoteAddress,
        First_Date_Time_Hit: Date.now(),
        Requested_Count: 1,
        // Log_History: JSON.stringify([
        //   {
        //     IP_Address: socket.conn.remoteAddress,
        //     timestamp: Date.now(),
        //     Date: moment(Date.now()).format("LLLL"),
        //   },
        // ]),
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
