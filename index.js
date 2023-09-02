const express = require("express");
const app = express();
const PORT = process.env.PORT || 4212;
const cors = require("cors");
const { sql, device } = require("./utils/db");
const { query, validationResult } = require("express-validator");
app.use(cors());

sql
  .sync()
  .then(async () => {
    console.log("connected To Database And Synced Sucessfully");

    // Create Device When Connected To DB
    // Check if The Device exists it will not Recreate it
    const uuid = "1b000924-12e3-4c37-81c0-a39c3cf139b1";

    await device.findOrCreate({
      where: { Device_ID: uuid },
      defaults: {
        Device_ID: uuid,
        Device_Token: "this is token",
        Display_Type: 2,
        Web_Url: "https://google.com",
        Image_URL:
          "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F24%2FBologna_sandwich.jpg&tbnid=fHZulXC0F_N0pM&vet=12ahUKEwiml-vum4KBAxV9ywIHHT9aCrIQMygOegUIARCdAQ..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSandwich&docid=QFQOhrhKlhFhiM&w=352&h=232&q=sandwich&ved=2ahUKEwiml-vum4KBAxV9ywIHHT9aCrIQMygOegUIARCdAQ",
        Mp4_URL: "https://youtu.be/1PUXucNLhe0",
        Offline_Image:
          "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F24%2FBologna_sandwich.jpg&tbnid=fHZulXC0F_N0pM&vet=12ahUKEwiml-vum4KBAxV9ywIHHT9aCrIQMygOegUIARCdAQ..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSandwich&docid=QFQOhrhKlhFhiM&w=352&h=232&q=sandwich&ved=2ahUKEwiml-vum4KBAxV9ywIHHT9aCrIQMygOegUIARCdAQ",
      },
    });
  })
  .catch((err) => {
    throw new Error(err);
  });

// Get data
app.get(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("token").isString().notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({});
    const { Device_ID, token } = req.query;
    const Device = await device.findOne({
      where: { Device_ID, Device_Token: token },
    });
    if (!Device)
      return res.status(401).json({
        message: "The Device uuid is Invaild or The Token is Invaild",
      });
    res.json(Device);
    // Update Last_Online_hit For The Next Request
    await device.update(
      {
        Last_Online_hit: Date.now(),
      },
      { where: { Device_ID } }
    );
  }
);

// Start the server
app.listen(PORT, () => {
  console.log("Server Is Running");
});
