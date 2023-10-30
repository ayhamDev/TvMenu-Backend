const { request, response } = require("express");
const { device } = require("../utils/db");
const { validationResult } = require("express-validator");
const { default: axios } = require("axios");
const imageToBase64 = require("image-to-base64");

const GetOffline = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { Device_ID, Device_Token, User_ID } = req.query;
  const Device = await device.findOne({
    where: { Device_ID, Device_Token, User_ID },
  });
  if (!Device)
    return res.status(404).json({
      message: "Device Not Found.",
    });
  if (Device.Offline_Image == "null" || !Device.Offline_Image)
    return res.status(404).json({
      message: "Offline Image Not Found",
    });
  //   const ImageRes = await fetch(Device.Offline_Image);
  //   const data = await ImageRes.arrayBuffer();
  //   const ImageEncoded = `data:image/png;base64,${Buffer.from(data).toString(
  //     "base64"
  //   )}`;
  //   res.send(ImageEncoded);
  //   fs.writeFileSync("./image.txt", ImageEncoded);
  imageToBase64(Device.Offline_Image)
    .then((response) => {
      res.send(`data:image/png;base64,${response}`);
    })
    .catch((error) => {
      res.status(500).json({
        message: "failed to Encode the image.",
        error,
      });
    });
};
module.exports = { GetOffline };
