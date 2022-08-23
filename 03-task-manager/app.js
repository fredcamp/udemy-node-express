const express = require("express");
const app = express();

const connectDB = require("./db/connect");
require("dotenv").config();

const tasks = require("./routes/tasks");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.use(express.static("./public"));
app.use(express.json());

app.use("/api/v1/tasks", tasks);

app.use(notFound);
app.use(errorHandler);

const port = 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
