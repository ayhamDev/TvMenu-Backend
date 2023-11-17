const { UUIDV4 } = require("sequelize");
const { User } = require("./db");
const bycrpt = require("bcrypt");
const { v4: uuid } = require("uuid");

const CreateDefaultAdmin = async () => {
  const FirstTime = await User.findOne({
    where: {
      Role: "Admin",
    },
  });

  if (!FirstTime) {
    console.log("Creating Admin Account.");
    const HashedPassword = await bycrpt.hash("admin", 10);
    await User.create({
      User_ID: uuid(),
      email: "admin@example.com",
      password: HashedPassword,
      Role: "Admin",
    });
    console.log("Admin Account Created.");
  }
};
module.exports = CreateDefaultAdmin;
