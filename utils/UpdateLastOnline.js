const { device } = require("./db");

const UpdateLastOnline = async (Device_ID, Device_Token) => {
  try {
    const Device = await device.findOne({
      where: { Device_ID, Device_Token },
    });
    if (Device) {
      Device.Last_Online_hit = Date.now();
      return Device.Last_Online_hit;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = UpdateLastOnline;
