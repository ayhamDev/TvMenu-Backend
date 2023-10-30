const { request, response } = require("express");
const { validationResult } = require("express-validator");
const { Programs, device } = require("../utils/db");
const { io } = require("../utils/Socket");

const GetProgram = async (req = request, res = response) => {
  try {
    const Program = await Programs.findAll({
      where: { ...req.query },
    });
    res.json(Program);
  } catch (err) {
    res.status(400).json({
      message: "Server Error",
    });
  }
};
const GetSingleProgram = async (req = request, res = response) => {
  try {
    const Program = await Programs.findOne({
      where: { ...req.query },
    });
    setTimeout(() => {
      res.json(Program);
    }, 2000);
  } catch (err) {
    res.status(400).json({
      message: "Server Error",
    });
  }
};
const CreateProgram = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  if (!req.body.Device_ID)
    return res.json({
      message: "Missing Field Device ID, Should Be an Array Of Devices ID",
    });
  let error = false;
  if (typeof req.body.Device_ID == "string") {
    try {
      req.body.Device_ID = JSON.parse(req.body.Device_ID);
    } catch (err) {
      error = true;
      return res.status(500).json({
        message: "Server Error",
      });
    }
  }
  if (typeof req.body.Start_DateTime == "string") {
    try {
      req.body.Start_DateTime = Number(req.body.Start_DateTime);
    } catch (err) {
      error = true;
      return res.json({
        message: "Server Error",
      });
    }
  }
  if (typeof req.body.End_DateTime == "string") {
    try {
      req.body.End_DateTime = Number(req.body.End_DateTime);
    } catch (err) {
      error = true;
      return res.json({
        message: "Server Error",
      });
    }
  }
  if (error) return undefined;
  const {
    Device_ID,
    Device_Token,
    User_ID,
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
    Program_Transition_End,
    Next_Loop_Seconds,
  } = req.body;

  try {
    const Program = await Programs.create({
      Device_ID: [...Device_ID],
      Device_Token,
      User_ID,
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
      Program_Transition_End,
      Next_Loop_Seconds,
    });

    Device_ID.forEach(async (id) => {
      const FoundDevice = await device.findOne({
        where: {
          Device_ID: id,
          Device_Token,
          User_ID,
        },
      });
      const device_programs = await Programs.findAll({
        where: {
          Device_Token,
          User_ID,
        },
      });
      const DevicePrograms = device_programs.filter((program) =>
        program.Device_ID.includes(id)
      );
      io.sockets.sockets
        .get(FoundDevice?.connectionID)
        ?.emit("device_programs", DevicePrograms);
    });

    res.json({
      message: "The Program Was Created Successfully.",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed To Create Program",
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
      const FoundDevice = await device.findAll({
        where: {
          Device_Token: Program.Device_Token,
          User_ID: Program.User_ID,
        },
      });
      const device_programs = await Programs.findAll({
        where: {
          Device_Token: Program.Device_Token,
          User_ID: Program.User_ID,
        },
      });
      FoundDevice.forEach((device) => {
        if (!Program.Device_ID.includes(device.Device_ID)) return undefined;
        const programs = device_programs.filter((program) =>
          program.Device_ID.includes(device.Device_ID)
        );
        io.sockets.sockets
          .get(device?.connectionID)
          ?.emit("device_programs", programs);
      });

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
    console.log(err);
    res.status(500).json({
      message: "Failed To Delete The Program.",
      Program_Row_Number: req.query.Program_Row_Number,
      error: err,
    });
  }
};
const DeleteProgramBulk = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const data = req.body.data;

  try {
    const BulkProgram = await Programs.findAll({
      where: {
        Program_Row_Number: data,
      },
    });
    const Deleted = await Programs.destroy({
      where: {
        Program_Row_Number: data,
      },
      force: true,
    });
    if (Deleted) {
      BulkProgram.forEach(async (program) => {
        const FoundDevices = await device.findAll({
          where: {
            Device_ID: program.Device_ID,
            Device_Token: program.Device_Token,
            User_ID: program.User_ID,
          },
        });
        const device_programs = await Programs.findAll({
          where: {
            Device_Token: program.Device_Token,
            User_ID: program.User_ID,
          },
        });
        FoundDevices.forEach((device) => {
          const programs = device_programs.filter((program) =>
            program.Device_ID.includes(device.Device_ID)
          );
          io.sockets.sockets
            .get(device?.connectionID)
            ?.emit("device_programs", programs);
        });
      });

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
    console.log(err);
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
      const DeivcesId =
        typeof Data.Device_ID == "string"
          ? JSON.parse(Data.Device_ID)
          : Data.Device_ID;
      const FoundDevices = await device.findAll({
        where: {
          Device_ID: DeivcesId,
          Device_Token: Data.Device_Token,
          User_ID: Data.User_ID,
        },
      });
      const device_programs = await Programs.findAll({
        where: {
          Device_Token: Data.Device_Token,
          User_ID: Data.User_ID,
        },
      });
      FoundDevices.forEach((device) => {
        const programs = device_programs.filter((program) =>
          program.Device_ID.includes(device.Device_ID)
        );
        io.sockets.sockets
          .get(device?.connectionID)
          ?.emit("device_programs", programs);
      });

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
const PatchProgramBulk = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const data = req.body.data;
  try {
    const Program = await Programs.findAll({
      where: {
        Program_Row_Number: data,
      },
    });
    if (Program.length == 0)
      return res.status(400).json({
        message: "Program Doesn't Exists",
        Program_Row_Number: req.query.Program_Row_Number,
      });
    Program.forEach(async (program) => {
      try {
        for (const key in req.query) {
          if (Object.hasOwnProperty.call(req.query, key)) {
            program[key] = req.query[key];
          }
        }
        const Data = await program.save();
        const DeivcesId = Data.Device_ID;
        const FoundDevices = await device.findAll({
          where: {
            Device_ID: DeivcesId,
            Device_Token: Data.Device_Token,
            User_ID: Data.User_ID,
          },
        });
        const device_programs = await Programs.findAll({
          where: {
            Device_Token: Data.Device_Token,
            User_ID: Data.User_ID,
          },
        });
        FoundDevices.forEach((device) => {
          const programs = device_programs.filter((program) =>
            program.Device_ID.includes(device.Device_ID)
          );
          io.sockets.sockets
            .get(device?.connectionID)
            ?.emit("device_programs", programs);
        });
      } catch (err) {
        console.log({ err });
      }
    });
    res.json({
      message: "Program Updated Successfully.",
      Program_Row_Number: req.query.Program_Row_Number,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed To Delete The Program.",
      Program_Row_Number: req.query.Program_Row_Number,
      error: err,
    });
  }
};
module.exports = {
  CreateProgram,
  GetSingleProgram,
  GetProgram,
  DeleteProgram,
  DeleteProgramBulk,
  PatchProgram,
  PatchProgramBulk,
};
