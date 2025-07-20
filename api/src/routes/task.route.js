import * as taskControllers from "../controllers/task.controller.js";
import { Router } from "express";

const taskRouter = Router();

taskRouter.post("/", taskControllers.createTaskController);

export default taskRouter;
