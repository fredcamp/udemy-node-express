const { StatusCodes } = require("http-status-codes");
const Job = require("../models/job");

const getJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ job, count: job.length });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  res.send("get job");
};

const updateJob = async (req, res) => {
  res.send("update job");
};

const deleteJob = async (req, res) => {
  res.send("delete job");
};

module.exports = {
  getJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};