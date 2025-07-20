import * as taskServices from "../services/task.service.js";

export const createTaskController = async (req, res) => {
  const { title, description, deadline, usersId } = req.body;

  if (!title || !description || !deadline || !usersId) {
    res
      .status(404)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const task = await taskServices.createTask(
      title,
      description,
      deadline,
      usersId
    );

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
