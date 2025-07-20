import * as taskControllers from "../controllers/task.controller.js";
import { Router } from "express";

const taskRouter = Router();

taskRouter.post("/", taskControllers.createTaskController);
taskRouter.get(
  "/active/:usersId",
  taskControllers.readAllActiveTasksController
);
taskRouter.get(
  "/completed/:usersId",
  taskControllers.readAllCompletedTasksController
);
taskRouter.get(
  "/failed/:usersId",
  taskControllers.readAllFailedTasksController
);
taskRouter.patch(
  "/complete/:usersId/:taskId",
  taskControllers.completeTaskController
);
taskRouter.delete("/:usersId/:taskId", taskControllers.deleteTaskController);

export default taskRouter;
