require("dotenv").config();
const express = require("express");
const app = express();

const User = require("./models/User");

const port = process.env.PORT || 5000;
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}.....`));
    await User.deleteMany({});
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
