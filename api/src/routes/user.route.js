import * as userControllers from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/", userControllers.createUserController);
userRouter.get("/", userControllers.getUserController);
userRouter.put("/", userControllers.editUserController);
userRouter.delete("/", userControllers.deleteUserController);

export default userRouter;
