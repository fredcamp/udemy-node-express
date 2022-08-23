const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: _id } = req.params;

  const task = await Task.findById(_id);
  if (!task) return next(createCustomError(`Cannot find ID: ${_id}`, 404));
  res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: _id } = req.params;

  const task = await Task.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) return next(createCustomError(`Cannot find ID: ${_id}`, 404));
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;

  const task = await Task.findByIdAndDelete(_id);
  if (!task) return next(createCustomError(`Cannot find ID: ${_id}`, 404));
  res.status(200).json({ task });
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
