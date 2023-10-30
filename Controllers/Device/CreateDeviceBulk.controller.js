const { response, request } = require("express");
const { device, UnRegisteredDevice, LogWriter } = require("../../utils/db");
const { validationResult } = require("express-validator");

const CreateDeviceBulk = async (req = request, res = response) => {
  const DevicesID = req.body.data;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const DevicesData = await UnRegisteredDevice.findAll({
      where: {
        id: DevicesID,
      },
    });
    if (!DevicesData)
      return res.status(404).json({
        message: "Devices Not found.",
      });
    const DevicesFormated = DevicesData.map((device) => {
      return {
        Device_ID: device.Unregistered_Device_ID,
        Device_Token: device.Device_Token,
        User_ID: device.User_ID,
      };
    });
    try {
      await device.bulkCreate(DevicesFormated);
      try {
        await UnRegisteredDevice.destroy({
          where: {
            id: DevicesID,
          },
          force: true,
        });
        await LogWriter.destroy({
          where: {
            id: DevicesID,
            Log_Type: "NewDevice",
          },
          force: true,
        });
        res.json({
          message: "Created All Devices Successfully",
          DevicesID,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "Failed To Create Devices",
          error: err,
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Failed To Create Devices",
        error: err,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed To Create Devices",
      error: err,
    });
  }
};
module.exports.CreateDeviceBulk = CreateDeviceBulk;
