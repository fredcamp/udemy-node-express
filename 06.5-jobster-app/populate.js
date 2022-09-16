require("dotenv").config();

const Job = require("./models/Job");
const jobMockData = require("./mock-data.json");

const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();
    await Job.create(jobMockData);
    console.log("Success...");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
