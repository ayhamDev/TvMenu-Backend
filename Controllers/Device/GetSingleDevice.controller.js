const { device } = require("../../utils/db");
const { response, request } = require("express");

const GetSingleDevice = async (req = request, res = response) => {
  try {
    if (Object.keys(req.query).length != 0) {
      const Device = await device.findOne({
        where: req.query,
      });
      if (!Device) {
        res.status(404).json(null);
      } else {
        res.json(Device);
      }
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(400).json({
      message: "Server Error",
    });
  }
};
module.exports.GetSingleDevice = GetSingleDevice;
