const { validationResult } = require("express-validator");
const { device, UnRegisteredDevice } = require("../../utils/db");
const { response, request } = require("express");

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
      if (!RegisteredDevice) {
        await UnRegisteredDevice.create({
          Unregistered_Device_ID: Device_ID,
          Device_Token,
          IP_Address: req.clientIp,
          First_Date_Time_Hit: Date.now(),
          Requested_Count: 1,
          // Log_History: JSON.stringify([
          //   {
          //     IP_Address: req.clientIp,
          //     timestamp: Date.now(),
          //     Date: moment(Date.now()).format("LLLL"),
          //   },
          // ]),
        });
        res.json({
          msg: "This Device Has Been Requested To Be Registered.",
          status: 101,
        });
      } else {
        RegisteredDevice.Requested_Count =
          Number(RegisteredDevice.Requested_Count) + 1;
        RegisteredDevice.Last_Date_Time_Hit = Date.now();
        RegisteredDevice.IP_Address = req.clientIp;
        // let Logs = JSON.parse(RegisteredDevice.Log_History);
        // Logs.push({
        //   IP_Address: req.clientIp,
        //   time: Date.now(),
        //   Date: moment(Date.now()).format("LLLL"),
        // });
        // RegisteredDevice.Log_History = JSON.stringify(Logs);
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
  } else {
    res.json(await device.findAll());
  }
};
module.exports.GetDevice = GetDevice;
