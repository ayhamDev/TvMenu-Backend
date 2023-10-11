const { request, response } = require("express");
const { validationResult } = require("express-validator");
const { Programs, device } = require("../utils/db");
const { io } = require("../utils/Socket");

const GetProgram = async (req = request, res = response) => {
  const Program = await Programs.findAll({
    where: { ...req.query },
  });
  res.json(Program);
};
const CreateProgram = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const {
    Device_ID,
    Device_Token,
    Program_Status,
    Program_Name,
    Program_Layer_Number,
    Start_DateTime,
    End_DateTime,
    Program_Type,
    Program_Web_Url,
    Program_Image_Url,
    Program_MP4_Url,
    Program_Note,
    Program_X,
    Program_Y,
    Program_W,
    Program_H,
    Program_Duration,
    Program_Transition,
    Next_Loop_Seconds,
  } = req.body;
  try {
    const Program = await Programs.create({
      Device_ID,
      Device_Token,
      Program_Status,
      Program_Name,
      Program_Layer_Number,
      Start_DateTime,
      End_DateTime,
      Program_Type,
      Program_Web_Url,
      Program_Image_Url,
      Program_MP4_Url,
      Program_Note,
      Program_X,
      Program_Y,
      Program_W,
      Program_H,
      Program_Duration,
      Program_Transition,
      Next_Loop_Seconds,
    });
    const FoundDevice = await device.findOne({
      where: {
        Device_ID,
        Device_Token,
      },
    });
    const device_programs = await Programs.findAll({
      where: {
        Device_ID,
        Device_Token,
      },
    });
    io.sockets.sockets
      .get(FoundDevice?.connectionID)
      ?.emit("device_programs", device_programs);
    res.json({
      message: "The Program Was Created Successfully.",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed To Create Command For The Device.",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
      error: err,
    });
  }
};
const DeleteProgram = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const Program = await Programs.findOne({
      where: {
        Program_Row_Number: req.query.Program_Row_Number,
      },
    });
    const Deleted = await Programs.destroy({
      where: {
        Program_Row_Number: req.query.Program_Row_Number,
      },
      force: true,
    });
    if (Deleted) {
      const FoundDevice = await device.findOne({
        where: {
          Device_ID: Program.Device_ID,
          Device_Token: Program.Device_Token,
        },
      });
      const device_programs = await Programs.findAll({
        where: {
          Device_ID: Program.Device_ID,
          Device_Token: Program.Device_Token,
        },
      });
      io.sockets.sockets
        .get(FoundDevice?.connectionID)
        ?.emit("device_programs", device_programs);
      res.json({
        message: "The Program Was Deleted Successfully.",
        Program_Row_Number: req.query.Program_Row_Number,
      });
    } else {
      res.status(400).json({
        message: "Program Doesn't Exists",
        Program_Row_Number: req.query.Program_Row_Number,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed To Delete The Program.",
      Program_Row_Number: req.query.Program_Row_Number,
      error: err,
    });
  }
};
const PatchProgram = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const Program = await Programs.findOne({
      where: {
        Program_Row_Number: req.query.Program_Row_Number,
      },
    });
    if (!Program)
      return res.status(400).json({
        message: "Program Doesn't Exists",
        Program_Row_Number: req.query.Program_Row_Number,
      });
    try {
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          Program[key] = req.body[key];
        }
      }
      const Data = await Program.save();
      const FoundDevice = await device.findOne({
        where: {
          Device_ID: Data.Device_ID,
          Device_Token: Data.Device_Token,
        },
      });
      const device_programs = await Programs.findAll({
        where: {
          Device_ID: Data.Device_ID,
          Device_Token: Data.Device_Token,
        },
      });
      io.sockets.sockets
        .get(FoundDevice?.connectionID)
        ?.emit("device_programs", device_programs);
      res.json({
        message: "Program Updated Successfully.",
        Program_Row_Number: req.query.Program_Row_Number,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed To Update The Program.",
        Program_Row_Number: req.query.Program_Row_Number,
        error: err,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed To Delete The Program.",
      Program_Row_Number: req.query.Program_Row_Number,
      error: err,
    });
  }
};
module.exports = { CreateProgram, GetProgram, DeleteProgram, PatchProgram };
