const { validationResult } = require("express-validator");
const { device, UnRegisteredDevice } = require("../../utils/db");

const CreateDevice = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const FoundDevice = await device.findOne({
      where: {
        Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
      },
    });
    if (FoundDevice)
      return res.status(409).json({
        message: "the device already exists",
      });

    const CreatedDevice = await device.create({
      Device_ID: req.body.Device_ID,
      Device_Token: req.body.Device_Token,
      Display_Type: req.body.Display_Type,
      Web_Url: req.body.Web_Url,
      Image_URL: req.body.Image_URL,
      Mp4_URL: req.body.Mp4_URL,
      Offline_Image: req.body.Offline_Image,
    });
    await UnRegisteredDevice.destroy({
      where: {
        Unregistered_Device_ID: req.body.Device_ID,
        Device_Token: req.body.Device_Token,
      },
    });
    res.json({
      message: "Device Created successfully",
      Device_ID: req.body.Device_ID,
      Device_Token: req.body.Device_Token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports.CreateDevice = CreateDevice;
