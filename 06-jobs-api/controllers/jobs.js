const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

const getJobs = async (req, res) => {
  const createdBy = req.user.userId;
  const jobs = await Job.find({ createdBy }).sort("createdAt");

  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id: ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;

  if (company === "" || position === "")
    throw new BadRequestError("Company and Position fields cannot be empty");

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) throw new NotFoundError(`No job with id: ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) throw new NotFoundError(`No job with id: ${jobId}`);
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};
