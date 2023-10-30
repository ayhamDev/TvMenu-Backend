const { validationResult } = require("express-validator");
const { io } = require("../../utils/Socket");
const { device } = require("../../utils/db");
const { response, request } = require("express");

const DeleteDevice = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const SocketDevice = await device.findOne({
      where: {
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
      },
    });
    if (!SocketDevice)
      return res.json({
        message: "Device Doesn't Exists",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
      });
    try {
      const DeletedDevice = await device.destroy({
        where: {
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        },
        force: true,
      });
      await LogWriter.destroy({
        where: {
          Device_ID: req.query.Device_ID,
        },
      });
      if (DeletedDevice == 0)
        return res.json({
          message: "The Device Doesn't Exist.",
          Device_ID: req.query.Device_ID,
          Device_Token: req.query.Device_Token,
        });
      io.sockets.sockets.get(SocketDevice.connectionID)?.disconnect();
      res.json({
        message: "The Device Was Deleted Successfully",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Couldn't Delete Device",
        Device_ID: req.query.Device_ID,
        Device_Token: req.query.Device_Token,
        error: err,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete Device",
      Device_ID: req.query.Device_ID,
      Device_Token: req.query.Device_Token,
      error: err,
    });
  }
};
module.exports.DeleteDevice = DeleteDevice;
