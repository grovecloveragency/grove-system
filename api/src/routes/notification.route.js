import * as notificationControllers from "../controllers/notification.controller.js";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.get(
  "/:usersId",
  notificationControllers.readNotificationsController
);

export default notificationRouter;
