import * as notificationControllers from "../controllers/notification.controller.js";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.get(
  "/:usersId",
  notificationControllers.getAllNotificationsController
);
notificationRouter.patch(
  "/:notificationId",
  notificationControllers.readNotificationsController
);
notificationRouter.delete(
  "/:notificationId",
  notificationControllers.deleteNotificationController
);

export default notificationRouter;
