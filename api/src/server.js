import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainRouter from "./routes/index.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

export default app;
