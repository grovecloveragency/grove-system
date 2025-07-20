import * as taskServices from "../services/task.service.js";

export const createTaskController = async (req, res) => {
  const { title, description, deadline, priority, usersId } = req.body;

  if (!title || !description || !deadline || !priority || !usersId) {
    res
      .status(404)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const task = await taskServices.createTask(
      title,
      description,
      deadline,
      priority,
      usersId
    );

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const readAllActiveTasksController = async (req, res) => {
  const { usersId } = req.params;

  if (!usersId) {
    res
      .status(404)
      .json({ success: false, message: "User ID not found in params" });
  }

  try {
    const tasks = await taskServices.readAllActiveTasks(usersId);
    res.status(200).json({ success: true, total: tasks.length, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const readAllCompletedTasksController = async (req, res) => {
  const { usersId } = req.params;

  if (!usersId) {
    res
      .status(404)
      .json({ success: false, message: "User ID not found in params" });
  }

  try {
    const tasks = await taskServices.readAllCompletedTasks(usersId);
    res.status(200).json({ success: true, total: tasks.length, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const readAllFailedTasksController = async (req, res) => {
  const { usersId } = req.params;

  if (!usersId) {
    res
      .status(404)
      .json({ success: false, message: "User ID not found in params" });
  }

  try {
    const tasks = await taskServices.readAllFailedTasks(usersId);
    res.status(200).json({ success: true, total: tasks.length, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const completeTaskController = async (req, res) => {
  const { usersId, taskId } = req.params;

  if (!usersId || !taskId) {
    res.status(404).json({
      success: false,
      message: "User ID and Task ID not found in params",
    });
  }

  try {
    const tasks = await taskServices.completeTask(usersId, taskId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTaskController = async (req, res) => {
  const { usersId, taskId } = req.params;

  if (!usersId || !taskId) {
    res.status(404).json({
      success: false,
      message: "User ID and Task ID not found in params",
    });
  }

  try {
    const tasks = await taskServices.deleteTask(usersId, taskId);
    res
      .status(200)
      .json({ success: true, message: `${tasks.title} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
