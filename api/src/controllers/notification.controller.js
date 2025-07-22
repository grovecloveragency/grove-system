import * as notificationServices from "../services/notification.service.js";

export const getAllNotificationsController = async (req, res) => {
  const { usersId } = req.params;

  if (!usersId) {
    res
      .status(404)
      .json({ success: false, message: "User ID not found in params" });
  }

  try {
    const notifications = await notificationServices.getAllNotifications(
      usersId
    );
    res.status(200).json({
      success: true,
      total: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const readNotificationsController = async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    res.status(404).json({
      success: false,
      message: "Notification ID not found in params or is invalid",
    });
  }

  try {
    const notifications = await notificationServices.readNotification(
      notificationId
    );
    res.status(200).json({
      success: true,
      message: `${notifications.title} has been read`,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotificationController = async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    res.status(404).json({
      success: false,
      message: "Notification ID not found in params or is invalid",
    });
  }

  try {
    const notifications = await notificationServices.deleteNotification(
      notificationId
    );
    res.status(200).json({
      success: true,
      message: `${notifications.title} has been deleted`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
