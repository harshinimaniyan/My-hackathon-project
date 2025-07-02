const Task = require('../models/task');
const mongoose = require('mongoose');

// Helper: get user id or fallback to dummy for testing
function getUserId(req) {
  // Use a dummy ownerId for testing if req.user is not set
  if (req.user && req.user._id) return req.user._id;
  return new mongoose.Types.ObjectId('000000000000000000000001');
}

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const ownerId = getUserId(req);
    const task = await Task.create({ ...req.body, ownerId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks for the user (owned or shared)
exports.getTasks = async (req, res) => {
  try {
    const userId = getUserId(req);
    const tasks = await Task.find({
      $or: [
        { ownerId: userId },
        { sharedWith: userId }
      ]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.ownerId.toString() !== userId.toString() && !task.sharedWith.includes(userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Share a task with another user
exports.shareTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!task.sharedWith.includes(req.body.userId)) {
      task.sharedWith.push(req.body.userId);
      await task.save();
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};