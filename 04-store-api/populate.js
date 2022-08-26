const express = require("express");
const app = express();
require("dotenv").config();

const Product = require("./models/product");
const jsonProducts = require("./products.json");

const connectDB = require("./db/connect");
const port = 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    app.listen(port, console.log(`Listening on port ${port}.....`));
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
