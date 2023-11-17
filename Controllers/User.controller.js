const { request, response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { User, Programs, device, Client } = require("../utils/db");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { io } = require("../utils/Socket");
const DeleteBulk = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const Users = await User.findAll({
      where: {
        User_ID: req.body.data,
      },
    });
    for (let index = 0; index < Users.length; index++) {
      await User.destroy({
        where: {
          User_ID: Users[index].User_ID,
        },
      });
      if (Users[index].Role == "Client") {
        try {
          await Client.destroy({
            where: {
              User_ID: Users[index].User_ID,
            },
          });
          try {
            await Programs.destroy({
              where: {
                User_ID: Users[index].User_ID,
              },
            });
            try {
              const Devices = await device.findAll({
                where: {
                  User_ID: Users[index].User_ID,
                },
              });
              await device.destroy({
                where: {
                  User_ID: Users[index].User_ID,
                },
              });
              for (let index = 0; index < Devices.length; index++) {
                io?.sockets?.sockets
                  ?.get(Devices[index].connectionID)
                  ?.disconnect();
              }
            } catch (err) {
              console.log(err);
              res.status(500).json({
                message: "Server Error: Couldn't Delete Devices for User",
                User_ID: User_ID,
              });
            }
          } catch (err) {
            res.status(500).json({
              message: "Server Error: Couldn't Delete Programs For User",
              User_ID: User_ID,
            });
          }
        } catch (err) {
          res.status(500).json({
            message: "Server Error: Couldn't Delete Client Details",
            User_ID: User_ID,
          });
        }
      }
      res.json({
        message:
          req.body.data.length == 1
            ? "User Deleted Successfully"
            : "Users Deleted Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error: Couldn't Delete Some Users Or All  Users",
      User_ID: User_ID,
    });
  }
};
const UpdateClient = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const ClientDetails = await Client.findOne({
    where: {
      User_ID: req.params.id,
    },
  });
  if (!ClientDetails)
    return res.status(404).json({
      message: "Client Not Found",
    });
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      ClientDetails[key] = req.body[key];
    }
  }
  try {
    await ClientDetails.save();
    res.json({
      message: "Client Details Updated Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Some Fields Are Not Correct",
    });
  }
};
const ChangePassword = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const Password = req.body.password;
  const User_ID = req.body.User_ID;
  try {
    const HashedPassword = await bcrypt.hash(Password, 10);
    try {
      await User.update(
        { password: HashedPassword },
        {
          where: {
            User_ID: User_ID,
          },
        }
      );
      res.json({
        message: "Password Changed Successfully",
        User_ID: User_ID,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error: Couldn't Change Password.",
        User_ID: User_ID,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server Error: Couldn't Change Password.",
      User_ID: User_ID,
    });
  }
};
const GetUsers = async (req = request, res = response) => {
  const UsersData = await User.findAll();
  if (!UsersData) return res.json([]);

  const UserDataFormatted = UsersData.map((user) => ({
    email: user.email,
    Role: user.Role,
    User_ID: user.User_ID,
  }));
  res.json(UserDataFormatted);
};

const GetUserById = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const UsersData = await User.findOne({
    where: {
      User_ID: req.query.User_ID,
    },
  });
  try {
    const { User_ID, email, Role, ...rest } = UsersData;
    if (Role == "Client") {
      const ClientDetails = await Client.findOne({
        where: {
          User_ID: req.query.User_ID,
        },
      });
      res.json({
        User_ID,
        email,
        Role,
        ClientDetails,
      });
    } else {
      res.json({
        User_ID,
        email,
        Role,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const CreateUser = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { email, password, Role } = req.body;
  const Exists = await User.findOne({
    where: { email },
  });
  if (Exists)
    return res.status(400).json({
      message: "User  With This Email Already Exists.",
      email,
    });
  try {
    const HashedPassword = await bcrypt.hash(password, 10);
    const User_ID = uuid();
    try {
      if (Role == "Client") {
        try {
          if (
            !req.body.Store_Name ||
            !req.body.City ||
            !req.body.State ||
            !req.body.Zip_Code ||
            !req.body.Country ||
            !req.body.Address
          )
            return res.status(400).json({
              message: "Client Details Are Required",
            });
          await User.create({
            User_ID,
            email,
            password: HashedPassword,
            Role,
          });
          await Client.create({
            User_ID,
            Store_Name: req.body.Store_Name,
            City: req.body.City,
            State: req.body.State,
            Zip_Code: req.body.Zip_Code,
            Country: req.body.Country,
            Address: req.body.Address,
          });
          const Token = jwt.sign(
            {
              User_ID,
              email: email,
              role: Role,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "3h",
            }
          );

          res.json({
            message: "Client Created Successfully",
            Role,
            Token,
          });
        } catch (err) {
          res.status(500).json({
            message: "Couldn't Create The User.",
          });
        }

        // You Fucked Up Mate You Need To Saparete the admin and client
      } else {
        await User.create({
          User_ID,
          email,
          password: HashedPassword,
          Role,
        });
        const Token = jwt.sign(
          {
            User_ID,
            email: email,
            role: Role,
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "3h",
          }
        );

        res.json({
          message: "Admin Created Successfully",
          Role,
          Token,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Couldn't Create The User.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Couldn't Hash The Password.",
    });
  }
};

const UserLogin = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { email, password } = req.body;
  const UserData = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!UserData)
    return res.status(404).json({
      message: "Email Or Password Is Incorrect.",
    });
  const eq = await bcrypt.compare(password, UserData.password);
  if (!eq)
    return res.status(404).json({
      message: "Email Or Password Is Incorrect.",
    });
  try {
    const Token = jwt.sign(
      {
        email: UserData.email,
        role: UserData.Role,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "3h",
      }
    );
    res.json({
      message: "Login Successfull",
      Token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Couldn't Create The Token.",
      err,
    });
  }
};
module.exports = {
  UserLogin,
  CreateUser,
  GetUsers,
  GetUserById,
  ChangePassword,
  DeleteBulk,
  UpdateClient,
};
