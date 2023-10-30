const { validationResult } = require("express-validator");
const { io } = require("../../utils/Socket");
const { device } = require("../../utils/db");
const { response, request } = require("express");

const PatchDevice = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const FoundDevice = await device.findOne({
      where: {
        Device_ID: req.query.id,
      },
    });
    if (!FoundDevice)
      return res.status(404).json({
        message:
          "Device Not Found, The Device uuid is Invaild or The Token is Invaild",
      });

    try {
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          FoundDevice[key] = req.body[key];
        }
      }
      const Data = await FoundDevice.save();
      if (FoundDevice.Status != "Active") {
        io.sockets.sockets.get(FoundDevice.connectionID)?.disconnect();
      }
      io.sockets.sockets
        .get(FoundDevice.connectionID)
        ?.emit("device_data", Data);

      return res.json({
        message: "Device updated successfully",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: "Failed To Updated Device",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
        error: err,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed To Updated Device",
      Device_ID: req.query.Device_ID,
      Device_Token: req.query.Device_Token,
      error: err,
    });
  }
};
module.exports.PatchDevice = PatchDevice;
