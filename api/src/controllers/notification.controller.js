import * as notificationServices from "../services/notification.service.js";

export const readNotificationsController = async (req, res) => {
  const usersId = req.params;

  if (!usersId) {
    res
      .status(404)
      .json({ success: false, message: "User ID not found in params" });
  }

  try {
    const notifications = await notificationServices.readNotifications(usersId);
    res
      .status(200)
      .json({
        success: true,
        total: notifications.length,
        data: notifications,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
