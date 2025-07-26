import * as userServices from "../services/user.service.js";

export const createUserController = async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    res
      .status(404)
      .json({ success: false, message: "Email and Name are required" });
  }

  try {
    const user = await userServices.createUser(name, email);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const editUserController = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    res
      .status(404)
      .json({ success: false, message: "Email and Name are required to edit" });
  }

  try {
    const user = await userServices.editUser(email, name);
    res
      .status(200)
      .json({ success: true, message: `${user.email} updated successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const deleteUserController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res
      .status(404)
      .json({ success: false, message: "Email is required to delete" });
  }

  try {
    const user = await userServices.deleteUser(email);
    res
      .status(200)
      .json({ success: true, message: `${user.email} deleted successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

export const getUserController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res
      .status(404)
      .json({ success: false, message: "Email is required to fetch details" });
  }

  try {
    const user = await userServices.getUser(email);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};
