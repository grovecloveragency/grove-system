import { Router } from "express";
import userRouter from "./user.route.js";
import notificationRouter from "./notification.route.js";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/notifications", notificationRouter);

export default mainRouter;
