const { validationResult } = require("express-validator");
const { device, UnRegisteredDevice, LogWriter } = require("../../utils/db");
const { response, request } = require("express");

const CreateDevice = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const FoundDevice = await device.findOne({
      where: {
        Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
        User_ID: req.body.User_ID,
      },
    });
    if (FoundDevice)
      return res.status(409).json({
        message: "the device already exists",
      });

    const CreatedDevice = await device.create({
      Device_ID: req.body.Device_ID,
      Device_Token: req.body.Device_Token,
      User_ID: req.body.User_ID,
      Display_Type: req.body.Display_Type,
      Offline_Image: req.body.Offline_Image,
    });
    await UnRegisteredDevice.destroy({
      where: {
        Unregistered_Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
        // User_ID: req.body.User_ID,
      },
      force: true,
    });

    await LogWriter.destroy({
      where: {
        Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
        User_ID: req.body.User_ID,
        Log_Type: "NewDevice",
      },
      force: true,
    });
    res.json({
      message: "Device Created successfully",
      Device_ID: req.body.Device_ID,
      Device_Token: req.body.Device_Token,
      User_ID: req.body.User_ID,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports.CreateDevice = CreateDevice;
