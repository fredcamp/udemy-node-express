const express = require("express");
const app = express();

require("dotenv").config();
require("express-async-errors");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const productsRoute = require("./routes/products");

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res
    .status(200)
    .send('<h1>Products API</h1><a href="/api/v1/products">Products</a>');
});
app.use("/api/v1/products", productsRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connect to DB
const connectDB = require("./db/connect");
const port = 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
