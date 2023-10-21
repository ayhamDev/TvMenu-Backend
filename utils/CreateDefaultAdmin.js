const { Admin } = require("./db");
const bycrpt = require("bcrypt");

const CreateDefaultAdmin = async () => {
  const FirstTime = await Admin.findOne();
  if (!FirstTime) {
    console.log("Creating Admin Account.");
    const HashedPassword = await bycrpt.hash("admin", 10);
    await Admin.create({
      email: "admin@example.com",
      password: HashedPassword,
    });
    console.log("Admin Account Created.");
  }
};
module.exports = CreateDefaultAdmin;
