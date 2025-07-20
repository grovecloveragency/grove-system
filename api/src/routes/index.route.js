import { Router } from "express";
import userRouter from "./user.route.js";

const mainRouter = Router();

mainRouter.use("/users", userRouter);

export default mainRouter;
