const { device, UnRegisteredDevice, LogWriter } = require("../../utils/db");
const { response, request } = require("express");
const moment = require("moment");

const GetDevice = async (req = request, res = response) => {
  const { Device_ID, Device_Token } = req.query;
  if (Device_ID && Device_Token) {
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
      if (!RegisteredDevice || !LogWriterData) {
        await UnRegisteredDevice.create({
          Unregistered_Device_ID: Device_ID,
          Device_Token,
          IP_Address: req.clientIp,
          First_Date_Time_Hit: Date.now(),
          Requested_Count: 1,
        });
        await LogWriter.create({
          Device_ID: Device_ID,
          Device_Token: Device_Token,
          Ip_Address: req.clientIp,
          Log_Type: "NewDevice",
          Log_Data: [
            {
              IP_Address: req.clientIp,
              timestamp: Date.now(),
              Date: moment(Date.now()).format("LLLL"),
            },
          ],
        });
        res.json({
          msg: "This Device Has Been Requested To Be Registered.",
        });
      } else {
        RegisteredDevice.Requested_Count =
          Number(RegisteredDevice.Requested_Count) + 1;
        RegisteredDevice.Last_Date_Time_Hit = Date.now();
        RegisteredDevice.IP_Address = req.clientIp;

        await RegisteredDevice.save();
        LogWriterData.Ip_Address = req.clientIp;
        const logData = LogWriterData.Log_Data;
        logData.push({
          IP_Address: req.clientIp,
          timestamp: Date.now(),
          Date: moment(Date.now()).format("LLLL"),
        });
        LogWriterData.Log_Data = logData;
        await LogWriterData.save();
        res.json({
          msg: "This Device Has Been Requested To Be Registered.",
        });
      }
    } else {
      res.json(Device);
    }
  } else {
    res.json(await device.findAll());
  }
};
module.exports.GetDevice = GetDevice;
