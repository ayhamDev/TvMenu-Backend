const { request, response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../utils/db");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

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

const CreateUser = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { email, password, Role } = req.body;
  const Exists = await User.findOne({
    where: { email },
  });
  if (Exists)
    return res.status(400).json({
      message: "a User With This Email Already Exists.",
      email,
    });
  try {
    const HashedPassword = await bcrypt.hash(password, 10);
    try {
      await User.create({
        User_ID: uuid(),
        email,
        password: HashedPassword,
        Role,
      });
      const Token = jwt.sign(
        {
          email: email,
          role: Role,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "3h",
        }
      );

      res.json({
        message: "User Created Successfully",
        Role,
        Token,
      });
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
module.exports = { UserLogin, CreateUser, GetUsers };
